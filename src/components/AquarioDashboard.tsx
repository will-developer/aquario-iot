import { Wifi, WifiOff } from 'lucide-react';

import { useMqtt } from '../hooks/useMqtt';
import type { HistoricoEvento } from '../types';
import { LIMITE_SEGURANCA } from '../utils/constants';

const mqttLabels = {
  connecting: '🟡 MQTT: CONECTANDO',
  connected: '🟢 MQTT: CONECTADO',
  reconnecting: '🟡 MQTT: RECONECTANDO',
  disconnected: '🔴 MQTT: DESCONECTADO',
  error: '🔴 MQTT: ERRO',
} as const;

const espLabels = {
  WAITING: '🟡 ESP32: AGUARDANDO',
  ONLINE: '🟢 ESP32: ONLINE',
  OFFLINE: '🔴 ESP32: OFFLINE',
} as const;

const mqttColors = {
  connecting: '#ffcc00',
  connected: '#00ff88',
  reconnecting: '#ffcc00',
  disconnected: '#ff4d4d',
  error: '#ff4d4d',
} as const;

const espColors = {
  WAITING: '#ffcc00',
  ONLINE: '#00ff88',
  OFFLINE: '#ff4d4d',
} as const;

export function AquarioDashboard() {
  const { payload, mqttStatus, espStatus, historico } = useMqtt();

  const nivelTexto =
    payload?.nivel === 'BAIXO'
      ? 'NÍVEL BAIXO'
      : payload
        ? 'NÍVEL NORMAL'
        : 'AGUARDANDO';
  const nivelCor = payload?.nivel === 'BAIXO' ? '#ff4d4d' : '#00ff88';
  const iconeNivel = payload?.nivel === 'BAIXO' ? '⚠️' : '💧';

  const bombaLigada = payload?.bomba === 'ON';
  const bombaTexto = bombaLigada
    ? 'BOMBA: LIGADA'
    : payload
      ? 'BOMBA: DESLIGADA'
      : 'BOMBA: ---';
  const bombaCor = bombaLigada ? '#00ff88' : '#ffffff';
  const bombaIcone = bombaLigada ? '🔄' : '⚙️';
  const tempoBomba = payload?.tempo_bomba ?? 0;
  const tempoBombaTexto = payload
    ? bombaLigada
      ? `Tempo de funcionamento: ${tempoBomba} / ${LIMITE_SEGURANCA} segundos`
      : `Tempo de funcionamento: ${tempoBomba} segundos`
    : 'Tempo de funcionamento: --';

  const segurancaTexto =
    payload?.seguranca === 'ATIVA'
      ? '🛡️ SEGURANÇA: TRAVA ATIVA'
      : payload
        ? '🛡️ SEGURANÇA: NORMAL'
        : '🛡️ SEGURANÇA: AGUARDANDO';

  const segurancaCor = payload?.seguranca === 'ATIVA' ? '#ff4d4d' : '#00ff88';
  const ultimaLeitura = payload?.timestamp ?? '--';

  return (
    <div className="dashboard-page">
      <header className="header">
        🌊 Sistema IoT de Monitoramento de Nível
        <small>Aquário Marinho</small>
      </header>

      <main className="card">
        <div className="nivel-icone">{iconeNivel}</div>
        <div className="nivel-texto" style={{ color: nivelCor }}>
          {nivelTexto}
        </div>

        <div className="bomba-area">
          <div className="bomba-icone">{bombaIcone}</div>
          <div className="bomba-texto" style={{ color: bombaCor }}>
            {bombaTexto}
          </div>
          <div className="tempo-bomba">{tempoBombaTexto}</div>
        </div>

        <div className="seguranca-box" style={{ color: segurancaCor }}>
          {segurancaTexto}
        </div>

        {payload?.seguranca === 'ATIVA' && (
          <div className="alerta-seguranca">
            ⚠️ TRAVA DE SEGURANÇA ATIVADA
            <br />
            <br />A bomba atingiu o limite de {LIMITE_SEGURANCA} segundos.
            <br />
            Verifique o sistema de abastecimento.
          </div>
        )}

        <div className="status-conexao">
          <div
            className="status-line"
            style={{ color: mqttColors[mqttStatus] }}
          >
            <Wifi size={14} /> {mqttLabels[mqttStatus]}
          </div>
          <div className="status-line" style={{ color: espColors[espStatus] }}>
            {espStatus === 'OFFLINE' ? (
              <WifiOff size={14} />
            ) : (
              <Wifi size={14} />
            )}{' '}
            {espLabels[espStatus]}
          </div>
        </div>

        <div className="ultima-leitura">Última leitura: {ultimaLeitura}</div>
      </main>

      <section className="card historico-card">
        <h3>📋 Histórico de alterações</h3>

        <div className="historico">
          {historico.length === 0 ? (
            <div className="historico-vazio">
              Aguardando primeira leitura...
            </div>
          ) : (
            historico.map((evento: HistoricoEvento, index: number) => {
              const eventoCor =
                evento.seguranca === 'ATIVA'
                  ? '#ff4d4d'
                  : evento.nivel === 'BAIXO'
                    ? '#ffcc00'
                    : '#00ff88';

              const textoBomba =
                evento.bomba === 'ON' ? '🟢 LIGADA' : '🔴 DESLIGADA';
              const textoSeguranca =
                evento.seguranca === 'ATIVA' ? '🛑 TRAVA ATIVA' : '🛡️ NORMAL';
              const eventoIcone =
                evento.seguranca === 'ATIVA'
                  ? '🛡️'
                  : evento.nivel === 'BAIXO'
                    ? '⚠️'
                    : '✔';

              return (
                <div
                  key={`${evento.timestamp}-${evento.nivel}-${evento.bomba}-${index}`}
                  className="evento"
                  style={{ color: eventoCor }}
                >
                  <strong>
                    {eventoIcone} {evento.nivel}
                  </strong>
                  <br />
                  Bomba: {textoBomba}
                  <br />
                  Segurança: {textoSeguranca}
                  <br />
                  <span className="evento-tempo">
                    ⏱️ Tempo da bomba: {evento.tempoBomba} segundos
                  </span>
                  <div className="evento-hora">{evento.timestamp}</div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <footer className="footer">
        UNIVESP - Projeto Integrador
        <br />
        Monitoramento IoT de nível
      </footer>
    </div>
  );
}
