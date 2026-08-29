export type NivelStatus = 'NORMAL' | 'BAIXO';
export type BombaStatus = 'ON' | 'OFF';
export type SegurancaStatus = 'NORMAL' | 'ATIVA';

export interface MqttPayload {
  nivel: NivelStatus;
  bomba: BombaStatus;
  seguranca: SegurancaStatus;
  tempo_bomba: number;
  timestamp: string;
}

export interface HistoricoEvento {
  nivel: NivelStatus;
  bomba: BombaStatus;
  seguranca: SegurancaStatus;
  tempoBomba: number;
  timestamp: string;
}
