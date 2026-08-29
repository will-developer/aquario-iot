import {
  Activity,
  AlertTriangle,
  Gauge,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Waves,
} from 'lucide-react';

import { useMqtt } from '../hooks/useMqtt';
import type { HistoricoEvento } from '../types';
import { LIMITE_SEGURANCA } from '../utils/constants';
import {
  espStatusConfig,
  levelConfig,
  mqttStatusConfig,
  pumpConfig,
  safetyConfig,
  toneClasses,
} from '../utils/dashboard';

export function AquarioDashboard() {
  const { payload, mqttStatus, espStatus, historico } = useMqtt();

  const nivelAtual = payload?.nivel === 'BAIXO' ? 'low' : 'normal';
  const NivelIcon = levelConfig[nivelAtual].icon;
  const nivelLabel = levelConfig[nivelAtual].label;

  const bombaLigada = payload?.bomba === 'ON';
  const bombaKey = bombaLigada ? 'on' : 'off';
  const BombaIcon = pumpConfig[bombaKey].icon;
  const bombaLabel = pumpConfig[bombaKey].label;
  const bombaTone = pumpConfig[bombaKey].tone;

  const segurancaAtiva = payload?.seguranca === 'ATIVA';
  const segurancaKey = segurancaAtiva ? 'active' : 'normal';
  const SegurancaIcon = safetyConfig[segurancaKey].icon;
  const segurancaLabel = safetyConfig[segurancaKey].label;

  const mqttConfig = mqttStatusConfig[mqttStatus];
  const espConfig = espStatusConfig[espStatus];
  const MqttIcon = mqttConfig.icon;
  const EspIcon = espConfig.icon;

  const ultimaLeitura = payload?.timestamp ?? '--';

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <header className="mx-auto max-w-3xl px-4 pt-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
          <Waves size={14} />
          Monitoramento IoT
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Sistema IoT de Monitoramento de Nível
        </h1>
        <p className="mt-2 text-sm text-slate-300">Aquário Marinho</p>
      </header>

      <main className="mx-auto mt-6 max-w-3xl space-y-4 px-4">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 rounded-full border border-cyan-400/20 bg-cyan-500/10 p-4 text-cyan-300">
              <NivelIcon className="h-12 w-12" />
            </div>

            <div
              className={`text-3xl font-bold sm:text-4xl ${toneClasses[levelConfig[nivelAtual].tone]}`}
            >
              {nivelLabel}
            </div>
          </div>

          <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
            <div className="flex items-center justify-center gap-3">
              <div className="rounded-full border border-white/10 bg-slate-800/80 p-3 text-cyan-300">
                <BombaIcon className="h-5 w-5" />
              </div>
              <div
                className={`text-xl font-semibold sm:text-2xl ${toneClasses[bombaTone]}`}
              >
                {bombaLabel}
              </div>
            </div>

            <div className="text-center text-sm text-slate-300">
              {payload
                ? bombaLigada
                  ? `Tempo de funcionamento: ${payload.tempo_bomba} / ${LIMITE_SEGURANCA} segundos`
                  : `Tempo de funcionamento: ${payload.tempo_bomba} segundos`
                : 'Tempo de funcionamento: --'}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm font-semibold">
            <SegurancaIcon
              className={`h-5 w-5 ${toneClasses[safetyConfig[segurancaKey].tone]}`}
            />
            <span className={toneClasses[safetyConfig[segurancaKey].tone]}>
              {segurancaLabel}
            </span>
          </div>

          {segurancaAtiva && (
            <div className="mt-5 rounded-2xl border border-rose-400/50 bg-rose-500/10 p-4 text-sm font-semibold text-rose-200">
              <div className="mb-3 flex items-center gap-2 font-bold">
                <AlertTriangle className="h-4 w-4" />
                TRAVA DE SEGURANÇA ATIVADA
              </div>
              <p className="leading-6 text-rose-100/90">
                A bomba atingiu o limite de {LIMITE_SEGURANCA} segundos.
                <br />
                Verifique o sistema de abastecimento.
              </p>
            </div>
          )}

          <div className="mt-6 space-y-3 text-left text-sm">
            <div
              className={`flex items-center gap-2 ${toneClasses[mqttConfig.tone]}`}
            >
              <MqttIcon className="h-4 w-4" />
              <span>{mqttConfig.label}</span>
            </div>
            <div
              className={`flex items-center gap-2 ${toneClasses[espConfig.tone]}`}
            >
              <EspIcon className="h-4 w-4" />
              <span>{espConfig.label}</span>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-300">
            Última leitura: {ultimaLeitura}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Histórico de alterações
          </h3>

          {historico.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-600 bg-slate-900/40 px-4 py-5 text-sm text-slate-300">
              Aguardando primeira leitura...
            </div>
          ) : (
            <div className="space-y-3">
              {historico.map((evento: HistoricoEvento, index: number) => {
                const eventoTone =
                  evento.seguranca === 'ATIVA'
                    ? 'danger'
                    : evento.nivel === 'BAIXO'
                      ? 'warning'
                      : 'success';

                const EventoIcon =
                  evento.seguranca === 'ATIVA'
                    ? ShieldAlert
                    : evento.nivel === 'BAIXO'
                      ? AlertTriangle
                      : ShieldCheck;

                return (
                  <div
                    key={`${evento.timestamp}-${evento.nivel}-${evento.bomba}-${index}`}
                    className="rounded-2xl border border-white/10 bg-slate-900/40 p-4"
                  >
                    <div
                      className={`flex items-center gap-2 font-semibold ${toneClasses[eventoTone]}`}
                    >
                      <EventoIcon className="h-4 w-4" />
                      {evento.nivel}
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-slate-200">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-cyan-300" />
                        Bomba: {evento.bomba === 'ON' ? 'LIGADA' : 'DESLIGADA'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-rose-300" />
                        Segurança:{' '}
                        {evento.seguranca === 'ATIVA'
                          ? 'TRAVA ATIVA'
                          : 'NORMAL'}
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Gauge className="h-4 w-4 text-amber-300" />
                        Tempo da bomba: {evento.tempoBomba} segundos
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-slate-400">
                      {evento.timestamp}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="pb-8 pt-6 text-center text-[11px] uppercase tracking-[0.18em] text-slate-400">
        UNIVESP - Projeto Integrador
        <br />
        Monitoramento IoT de nível
      </footer>
    </div>
  );
}
