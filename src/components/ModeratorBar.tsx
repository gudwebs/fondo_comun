import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, Dices, Eye, EyeOff, Shield, X } from 'lucide-react';
import { Decision, GameMode, PlayerState, RoundStep } from '../game/types';
import { CONTRIBUTION_COST, TOTAL_ROUNDS } from '../game/engine';
import { getPlayerColor } from '../game/colors';

interface ModeratorBarProps {
  mode: GameMode;
  moderatorName: string;
  round: number;
  step: RoundStep;
  commentary: string;
  isDiceRolling: boolean;
  activeTurnPlayer: PlayerState | null;
  pendingDecisionsCount: number;
  moderatorPeek: boolean;
  onToggleModeratorPeek: () => void;
  onPlayerDecision: (playerId: string, decision: Decision) => void;
  onAdvanceStep: () => void;
}

const STEPS: Array<{ key: string; number: number; label: string; activeOn: RoundStep[] }> = [
  { key: 'decision', number: 1, label: 'Decisión', activeOn: ['DECISION', 'REVEAL'] },
  { key: 'payment', number: 2, label: 'Pago', activeOn: ['PAYMENT'] },
  { key: 'dice', number: 3, label: 'Dados', activeOn: ['DICE'] },
  { key: 'resolution', number: 4, label: 'Accidentes', activeOn: ['RESOLUTION', 'ROUND_END'] },
];

export const ModeratorBar: React.FC<ModeratorBarProps> = ({
  mode,
  moderatorName,
  round,
  step,
  commentary,
  isDiceRolling,
  activeTurnPlayer,
  pendingDecisionsCount,
  moderatorPeek,
  onToggleModeratorPeek,
  onPlayerDecision,
  onAdvanceStep,
}) => {
  const showSecretDecisionButtons =
    step === 'DECISION' &&
    activeTurnPlayer !== null &&
    !activeTurnPlayer.eliminated &&
    !activeTurnPlayer.cannotAffordContribution;

  const canAfford = (activeTurnPlayer?.chips ?? 0) >= CONTRIBUTION_COST;

  const getPrimaryLabel = (): string => {
    if (isDiceRolling) return 'Tirando dados…';
    switch (step) {
      case 'DECISION':
        return 'Voltear tarjetas';
      case 'REVEAL':
        return 'Meter aportes al fondo';
      case 'PAYMENT':
        return 'Lanzar los dados';
      case 'DICE':
        return 'Resolver accidentes';
      case 'RESOLUTION':
      case 'ROUND_END':
        return round >= TOTAL_ROUNDS ? 'Repartir fondo final' : `Pasar a Ronda ${round + 1}`;
      default:
        return 'Continuar';
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[#D9A441]/28 bg-[#081A14]/94 p-4 sm:p-5 shadow-[0_14px_38px_rgba(0,0,0,0.45)] backdrop-blur-md">
      {/* Top Row: 4-Step Progress Bar + Mode/Moderator label */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-3">
        <ol
          className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs"
          aria-label="Pasos de la ronda"
        >
          {STEPS.map((s) => {
            const isActive = s.activeOn.includes(step);
            const stepOrder = STEPS.findIndex((item) => item.activeOn.includes(step));
            const thisIdx = STEPS.findIndex((item) => item.key === s.key);
            const isDone = thisIdx < stepOrder;

            return (
              <li
                key={s.key}
                className={`flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'font-semibold text-[#F6DC99]'
                    : isDone
                    ? 'text-[#6EE7B7]'
                    : 'text-[#6F897E]'
                }`}
              >
                <span className="font-mono-tabular">{s.number}.</span>
                <span>{s.label}</span>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[#9BB2A7]">
          <span>
            {mode === 'GUIDED_DEMO'
              ? 'Modo: Ejemplo oficial'
              : mode === 'PLAY_VS_BOTS'
              ? 'Modo: Contra 5 rivales automáticos'
              : `Moderador: ${moderatorName || 'Moderador'}`}
          </span>

          {mode === 'MODERATOR' && step === 'DECISION' && pendingDecisionsCount > 0 && (
            <>
              <span aria-hidden="true" className="text-[#567065]">
                ·
              </span>
              <span className="font-mono-tabular text-[#F6DC99]">
                Faltan {pendingDecisionsCount} por decidir
              </span>
            </>
          )}

          {mode === 'MODERATOR' && step === 'DECISION' && (
            <button
              type="button"
              onClick={onToggleModeratorPeek}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#D9A441]/35 bg-[#102920] px-2.5 py-1 text-xs font-medium text-[#F5F2EB] transition-colors hover:bg-[#17382C] whitespace-nowrap cursor-pointer"
            >
              {moderatorPeek ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-[#D9A441]" aria-hidden="true" />
                  Ocultar cartas
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-[#D9A441]" aria-hidden="true" />
                  Ver cartas
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Moderator Commentary + Context Action */}
      <div className="mt-3.5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${round}-${step}-${activeTurnPlayer?.id ?? 'none'}-${commentary.slice(0, 28)}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-sm sm:text-[15px] leading-relaxed text-[#EFF4F1]"
            >
              {commentary}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {showSecretDecisionButtons && activeTurnPlayer ? (
            <>
              <span
                className={`inline-flex items-center gap-2 text-xs font-semibold whitespace-nowrap ${
                  getPlayerColor(activeTurnPlayer.colorId).turnText
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    getPlayerColor(activeTurnPlayer.colorId).swatchBg
                  }`}
                  aria-hidden="true"
                />
                Turno de {activeTurnPlayer.name}:
              </span>
              <button
                type="button"
                disabled={!canAfford}
                onClick={() => onPlayerDecision(activeTurnPlayer.id, 'APORTO')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F7653] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-transform duration-150 hover:bg-[#138A62] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6EE7B7] whitespace-nowrap cursor-pointer"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Aportar (2 fichas)
              </button>
              <button
                type="button"
                onClick={() => onPlayerDecision(activeTurnPlayer.id, 'NO_APORTO')}
                className="inline-flex items-center gap-2 rounded-xl border border-[#EF4444]/60 bg-[#2C1417] px-5 py-3 text-sm font-semibold text-[#FECACA] transition-transform duration-150 hover:bg-[#3B191D] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCA5A5] whitespace-nowrap cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                No aportar
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={isDiceRolling || (step === 'DECISION' && pendingDecisionsCount > 0)}
              onClick={onAdvanceStep}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D9A441] px-6 py-3 text-sm font-semibold text-[#111915] shadow-md transition-transform duration-150 hover:bg-[#E5B55A] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F2EB] whitespace-nowrap cursor-pointer"
            >
              {step === 'PAYMENT' ? (
                <Dices className="h-4 w-4" aria-hidden="true" />
              ) : step === 'DICE' ? (
                <Shield className="h-4 w-4" aria-hidden="true" />
              ) : null}
              <span>{getPrimaryLabel()}</span>
              {!isDiceRolling && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
