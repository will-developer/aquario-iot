import { useEffect, useRef, useState } from 'react';
import mqtt, { type IClientOptions, type MqttClient } from 'mqtt';

import type { HistoricoEvento, MqttPayload } from '../types';
import {
  MAX_EVENTOS_HISTORICO,
  MQTT_BROKER,
  MQTT_PASSWORD,
  MQTT_TOPIC,
  MQTT_USER,
  TEMPO_OFFLINE,
} from '../utils/constants';

type MqttConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';
type EspStatus = 'WAITING' | 'ONLINE' | 'OFFLINE';

export function useMqtt() {
  const clientRef = useRef<MqttClient | null>(null);
  const previousStateRef = useRef<string | null>(null);

  const [payload, setPayload] = useState<MqttPayload | null>(null);
  const [mqttStatus, setMqttStatus] =
    useState<MqttConnectionStatus>('connecting');
  const [espStatus, setEspStatus] = useState<EspStatus>('WAITING');
  const [lastMessageAt, setLastMessageAt] = useState<number | null>(null);
  const [historico, setHistorico] = useState<HistoricoEvento[]>([]);

  useEffect(() => {
    if (clientRef.current) {
      return;
    }

    const options: IClientOptions = {
      username: MQTT_USER,
      password: MQTT_PASSWORD,
      reconnectPeriod: 5000,
    };

    const client = mqtt.connect(MQTT_BROKER, options);
    clientRef.current = client;

    const handleConnect = () => {
      setMqttStatus('connected');

      client.subscribe(MQTT_TOPIC, (error) => {
        if (error) {
          console.error('Erro ao assinar o tópico MQTT:', error);
          setMqttStatus('error');
          return;
        }

        console.log('Tópico assinado:', MQTT_TOPIC);
      });
    };

    const handleClose = () => {
      setMqttStatus('disconnected');
    };

    const handleError = (error: Error) => {
      console.error('Erro MQTT:', error);
      setMqttStatus('error');
    };

    const handleReconnect = () => {
      setMqttStatus('reconnecting');
    };

    const handleMessage = (topic: string, message: Buffer) => {
      if (topic !== MQTT_TOPIC) {
        return;
      }

      try {
        const data = JSON.parse(message.toString()) as Partial<MqttPayload>;

        const nextPayload: MqttPayload = {
          nivel: data.nivel ?? 'NORMAL',
          bomba: data.bomba ?? 'OFF',
          seguranca: data.seguranca ?? 'NORMAL',
          tempo_bomba: Number(data.tempo_bomba ?? 0),
          timestamp: data.timestamp ?? new Date().toISOString(),
        };

        setPayload(nextPayload);
        setLastMessageAt(Date.now());
        setEspStatus('ONLINE');

        const estadoAtual = `${nextPayload.nivel}|${nextPayload.bomba}|${nextPayload.seguranca}`;

        const evento: HistoricoEvento = {
          nivel: nextPayload.nivel,
          bomba: nextPayload.bomba,
          seguranca: nextPayload.seguranca,
          tempoBomba: nextPayload.tempo_bomba,
          timestamp: nextPayload.timestamp,
        };

        if (
          previousStateRef.current === null ||
          previousStateRef.current !== estadoAtual
        ) {
          previousStateRef.current = estadoAtual;

          setHistorico((currentHistorico) =>
            [evento, ...currentHistorico].slice(0, MAX_EVENTOS_HISTORICO),
          );
        }
      } catch (error) {
        console.error('JSON inválido recebido do MQTT:', error);
      }
    };

    client.on('connect', handleConnect);
    client.on('close', handleClose);
    client.on('error', handleError);
    client.on('reconnect', handleReconnect);
    client.on('message', handleMessage);

    return () => {
      const activeClient = clientRef.current;

      if (activeClient) {
        activeClient.removeListener('connect', handleConnect);
        activeClient.removeListener('close', handleClose);
        activeClient.removeListener('error', handleError);
        activeClient.removeListener('reconnect', handleReconnect);
        activeClient.removeListener('message', handleMessage);

        activeClient.end(true);
        clientRef.current = null;
      }

      previousStateRef.current = null;
      setMqttStatus('disconnected');
      setEspStatus('WAITING');
    };
  }, []);

  useEffect(() => {
    if (lastMessageAt === null) {
      return;
    }

    const timer = window.setInterval(() => {
      const diff = Date.now() - lastMessageAt;
      setEspStatus(diff > TEMPO_OFFLINE ? 'OFFLINE' : 'ONLINE');
    }, 2000);

    return () => {
      window.clearInterval(timer);
    };
  }, [lastMessageAt]);

  return {
    payload,
    mqttStatus,
    espStatus,
    historico,
  };
}
