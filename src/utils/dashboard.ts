import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Gauge,
  ShieldAlert,
  ShieldCheck,
  Wifi,
  WifiOff,
} from 'lucide-react';

export type MqttStatusKey =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

export type EspStatusKey = 'WAITING' | 'ONLINE' | 'OFFLINE';

export const mqttStatusConfig: Record<
  MqttStatusKey,
  {
    label: string;
    icon: LucideIcon;
    tone: 'warning' | 'success' | 'danger' | 'muted';
  }
> = {
  connecting: {
    label: 'MQTT: CONECTANDO',
    icon: Wifi,
    tone: 'warning',
  },
  connected: {
    label: 'MQTT: CONECTADO',
    icon: Wifi,
    tone: 'success',
  },
  reconnecting: {
    label: 'MQTT: RECONECTANDO',
    icon: Wifi,
    tone: 'warning',
  },
  disconnected: {
    label: 'MQTT: DESCONECTADO',
    icon: WifiOff,
    tone: 'danger',
  },
  error: {
    label: 'MQTT: ERRO',
    icon: WifiOff,
    tone: 'danger',
  },
};

export const espStatusConfig: Record<
  EspStatusKey,
  {
    label: string;
    icon: LucideIcon;
    tone: 'warning' | 'success' | 'danger';
  }
> = {
  WAITING: {
    label: 'ESP32: AGUARDANDO',
    icon: Wifi,
    tone: 'warning',
  },
  ONLINE: {
    label: 'ESP32: ONLINE',
    icon: Wifi,
    tone: 'success',
  },
  OFFLINE: {
    label: 'ESP32: OFFLINE',
    icon: WifiOff,
    tone: 'danger',
  },
};

export const toneClasses = {
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  danger: 'text-rose-400',
  muted: 'text-slate-300',
} as const;

export const levelConfig = {
  low: {
    label: 'NÍVEL BAIXO',
    icon: AlertTriangle,
    tone: 'danger',
  },
  normal: {
    label: 'NÍVEL NORMAL',
    icon: Gauge,
    tone: 'success',
  },
} as const;

export const pumpConfig = {
  on: {
    label: 'BOMBA: LIGADA',
    icon: Gauge,
    tone: 'success',
  },
  off: {
    label: 'BOMBA: DESLIGADA',
    icon: ShieldCheck,
    tone: 'muted',
  },
} as const;

export const safetyConfig = {
  active: {
    label: 'SEGURANÇA: TRAVA ATIVA',
    icon: ShieldAlert,
    tone: 'danger',
  },
  normal: {
    label: 'SEGURANÇA: NORMAL',
    icon: ShieldCheck,
    tone: 'success',
  },
} as const;
