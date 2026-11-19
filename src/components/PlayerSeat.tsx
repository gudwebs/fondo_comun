import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, Check, ChevronRight, ShieldCheck, Skull, X } from 'lucide-react';
import { GameMode, PlayerState, RoundStep } from '../game/types';
import { TOTAL_ROUNDS } from '../game/engine';
import { getPlayerColor } from '../game/colors';
import { TactileDie } from './TactileDie';

const CARD_BACK_IMAGE = '/src/assets/images/card_back_pattern_1795110218130.jpg';

interface PlayerSeatProps {
  player: PlayerState;
  step: RoundStep;
  mode: GameMode;
  round: number;
  isDiceRolling: boolean;
  moderatorPeek: boolean;
  isCurrentTurn: boolean;
  hasActiveTurn: boolean;
  onSelectSeatForTurn?: (playerId: string) => void;
  onModeratorToggleDie?: (playerId: string) => void;
}

export const PlayerSeat: React.FC<PlayerSeatProps> = ({
  player,
  step,
  mode,
  round,
  isDiceRolling,
  moderatorPeek,
  isCurrentTurn,
  hasActiveTurn,
  onSelectSeatForTurn,
  onModeratorToggleDie,
}) => {
  const [cardBackError, setCardBackError] = useState(false);
  const color = getPlayerColor(player.colorId);

  const isRevealed =
    step === 'REVEAL' ||
    step === 'PAYMENT' ||
    step === 'DICE' ||
    step === 'RESOLUTION' ||
    step === 'ROUND_END';

  const showFaceUp =
    !player.eliminated &&
    player.currentDecision !== null &&
    (isRevealed ||
      (player.isHuman && step === 'DECISION') ||
      (mode === 'MODERATOR' && moderatorPeek && step === 'DECISION'));

  const canSelectForTurn =
    mode === 'MODERATOR' &&
    step === 'DECISION' &&
    !player.eliminated &&
    !player.cannotAffordContribution;

  const canModeratorEditDie =
    mode === 'MODERATOR' &&
    step === 'DICE' &&
    !player.eliminated &&
    !isDiceRolling &&
    player.currentDie !== null;

  const isAccident = player.currentDie === 1 && !isDiceRolling && !player.eliminated;
  const isProtected =
    player.roundOutcome?.type === 'COVERED_BY_FUND' ||
    player.roundOutcome?.type === 'PARTIAL_FUND_COVERED';
  const isSelfPaid = player.roundOutcome?.type === 'SELF_PAID';

  const visibleChipCount = Math.min(player.chips, 14);
  const stillFaithful =
    !player.eliminated && player.contributionHistory.every((c) => c === true);

  const isHaloActive = isCurrentTurn && !player.eliminated;

  return (
    <motion.section
      layout={false}
      animate={
        isAccident && step === 'RESOLUTION' && !isProtected
          ? { x: [0, -5, 5, -3, 3, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => {
        if (canSelectForTurn && onSelectSeatForTurn) {
          onSelectSeatForTurn(player.id);
        }
      }}
      aria-label={`Jugador ${player.name}${isCurrentTurn ? ' — Turno actual' : ''}`}
      className={`seat-shell relative flex flex-col justify-between rounded-2xl border p-4 ${
        canSelectForTurn ? 'cursor-pointer hover:border-white/40' : ''
      } ${
        player.eliminated
          ? 'border-white/8 bg-[#0A1713]/72 opacity-60'
          : isHaloActive
          ? `${color.seatActiveClasses} z-10 scale-[1.018]`
          : isAccident && step === 'DICE'
          ? 'border-[#EF4444]/75 bg-[#1B1618]/90 shadow-[0_8px_28px_rgba(220,38,38,0.22)]'
          : isAccident && step === 'RESOLUTION' && isProtected
          ? 'border-[#10B981]/70 bg-[#0D271E]/92 shadow-[0_8px_24px_rgba(16,185,129,0.2)]'
          : hasActiveTurn && step === 'DECISION'
          ? `${color.seatIdleBorder} bg-[#0A1D17]/82 opacity-72`
          : `${color.seatIdleBorder} bg-[#0C211A]/90 shadow-[0_6px_20px_rgba(0,0,0,0.28)]`
      }`}
    >
      {/* Smooth CSS-Transitioned Luminous Turn Halo */}
      <div
        aria-hidden="true"
        className={`seat-turn-halo ${color.haloClasses} ${isHaloActive ? 'is-active' : ''}`}
      />

      {/* Header Row: Monogram + Name + Turn Cue + Fidelity history + Chips count */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {/* Distinctive Player Color Monogram */}
          <div
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono-tabular text-xs font-bold transition-transform duration-300 ${
              player.eliminated
                ? 'border-white/15 bg-black/30 text-[#7B8E85]'
                : color.monogramClasses
            } ${isHaloActive ? 'scale-105' : ''}`}
            aria-hidden="true"
          >
            {player.initials}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-display text-base font-semibold text-[#F5F2EB]">
                {player.name}
              </h3>
              {isHaloActive && (
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-semibold whitespace-nowrap ${color.turnText}`}
                >
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  Turno actual
                </span>
              )}
              {player.eliminated && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FCA5A5] whitespace-nowrap">
                  <Skull className="h-3.5 w-3.5" aria-hidden="true" />
                  Eliminado
                </span>
              )}
            </div>

            {/* Unboxed metadata row: role/fidelity + 5-round contribution squares */}
            <div className="mt-1 flex items-center gap-2 text-xs text-[#9BB2A7]">
              <span className="truncate">
                {player.eliminated
                  ? `Ronda ${player.eliminatedRound}`
                  : stillFaithful && player.contributionHistory.length > 0
                  ? 'Socio fiel'
                  : player.personalityLabel}
              </span>
              <span aria-hidden="true" className="text-[#5C776B]">
                ·
              </span>
              <div
                className="flex items-center gap-1"
                title="Historial de aportes por ronda (5 rondas)"
                aria-label={`Aportes realizados: ${
                  player.contributionHistory.filter(Boolean).length
                } de ${TOTAL_ROUNDS}`}
              >
                {Array.from({ length: TOTAL_ROUNDS }).map((_, idx) => {
                  const hist = player.contributionHistory[idx];
                  const isCurrent = idx === round - 1 && !player.eliminated;
                  return (
                    <span
                      key={idx}
                      className={`h-2 w-2 rounded-[2px] transition-colors ${
                        hist === true
                          ? 'bg-[#D9A441]'
                          : hist === false
                          ? 'bg-[#EF4444]/65'
                          : isCurrent
                          ? 'border border-[#D9A441]/70 bg-transparent'
                          : 'bg-white/12'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabular Chip Count & Floating Delta */}
        <div className="relative flex flex-col items-end shrink-0">
          <div className="flex items-baseline gap-1">
            <span className="font-mono-tabular text-xl font-bold text-[#F6DC99]">
              {player.chips}
            </span>
            <span className="text-xs text-[#9BB2A7]">fichas</span>
          </div>

          {/* Mini Gold Chip Stack Bar */}
          <div className="mt-1 flex items-center gap-[3px]" aria-hidden="true">
            {visibleChipCount > 0 ? (
              Array.from({ length: visibleChipCount }).map((_, i) => (
                <span key={i} className="gold-chip h-2 w-2 rounded-full" />
              ))
            ) : (
              <span className="text-[11px] text-[#7D968A]">Sin fichas</span>
            )}
          </div>

          <AnimatePresence>
            {player.lastDelta !== null &&
              player.lastDelta !== 0 &&
              (step === 'PAYMENT' || step === 'RESOLUTION') && (
                <motion.span
                  key={`${round}-${step}-${player.lastDelta}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className={`mt-1 font-mono-tabular text-xs font-bold ${
                    player.lastDelta < 0 ? 'text-[#FCA5A5]' : 'text-[#6EE7B7]'
                  }`}
                >
                  {player.lastDelta > 0 ? `+${player.lastDelta}` : player.lastDelta} fichas
                </motion.span>
              )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Play Row: 3D Decision Card + Tactile Die */}
      <div className="relative z-10 mt-3.5 flex items-center justify-between gap-4 border-t border-white/8 pt-3.5">
        {/* 3D Decision Card reflecting player's distinctive color */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="card-perspective h-[86px] w-[64px] shrink-0">
            {player.eliminated ? (
              <div className="flex h-full w-full items-center justify-center rounded-lg border border-white/10 bg-black/30">
                <Skull className="h-5 w-5 text-[#7B8E85]" aria-hidden="true" />
              </div>
            ) : (
              <div
                className={`card-inner h-full w-full rounded-lg ${
                  showFaceUp ? 'is-flipped' : ''
                }`}
              >
                {/* Card Back (Boca abajo) with player color frame & top seal */}
                <div
                  className={`card-face overflow-hidden rounded-lg border-2 bg-[#0A261B] shadow-md transition-colors duration-300 ${color.cardBackBorder}`}
                >
                  {!cardBackError ? (
                    <img
                      src={CARD_BACK_IMAGE}
                      alt="Tarjeta boca abajo"
                      referrerPolicy="no-referrer"
                      onError={() => setCardBackError(true)}
                      className="h-full w-full object-cover scale-[1.09]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0F3A2A] to-[#081F17] p-1">
                      <div className="flex h-full w-full items-center justify-center rounded border border-[#D9A441]/50">
                        <span className="font-display text-sm font-bold text-[#D9A441]">?</span>
                      </div>
                    </div>
                  )}

                  {player.currentDecision === null && step === 'DECISION' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/52">
                      <span
                        className={`text-[10px] font-semibold ${
                          isHaloActive ? color.turnText : 'text-[#D6E2DC]'
                        }`}
                      >
                        {isHaloActive ? 'Elige' : 'Espera'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Front (Volteada) with Player Color Top Ribbon + Verdict */}
                <div
                  className={`card-face card-face-front flex flex-col justify-between overflow-hidden rounded-lg border-2 shadow-md ${
                    player.currentDecision === 'APORTO'
                      ? 'border-[#10B981] bg-[#FAF7F0] text-[#0E3325]'
                      : 'border-[#DC2626] bg-[#FAF4F2] text-[#5B1414]'
                  }`}
                >
                  {/* Player distinctive color identity bar */}
                  <div className={`h-1.5 w-full shrink-0 ${color.cardFrontRibbon}`} aria-hidden="true" />

                  <div className="flex flex-1 flex-col items-center justify-between px-1 py-1.5">
                    {player.currentDecision === 'APORTO' ? (
                      <>
                        <Check
                          className="h-3.5 w-3.5 text-[#059669]"
                          strokeWidth={2.8}
                          aria-hidden="true"
                        />
                        <span className="text-center text-[10px] font-bold leading-tight tracking-tight">
                          APORTO
                        </span>
                        <span className="font-mono-tabular text-[10px] font-semibold text-[#047857]">
                          −2
                        </span>
                      </>
                    ) : (
                      <>
                        <X
                          className="h-3.5 w-3.5 text-[#DC2626]"
                          strokeWidth={2.8}
                          aria-hidden="true"
                        />
                        <span className="text-center text-[9.5px] font-bold leading-tight tracking-tight">
                          NO APORTO
                        </span>
                        <span className="font-mono-tabular text-[10px] font-semibold text-[#B91C1C]">
                          0
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card Status Text (Unboxed, crisp hierarchy) */}
          <div className="min-w-0 flex-1">
            {player.eliminated ? (
              <p className="text-xs text-[#8BA197]">Sin fichas para continuar.</p>
            ) : step === 'DECISION' ? (
              <div>
                <p
                  className={`text-xs font-semibold ${
                    isHaloActive
                      ? color.turnText
                      : player.currentDecision !== null
                      ? 'text-[#6EE7B7]'
                      : 'text-[#C5D3CC]'
                  }`}
                >
                  {player.cannotAffordContribution
                    ? 'Sin fichas para aportar'
                    : isHaloActive
                    ? 'Elige en los botones de abajo'
                    : player.currentDecision === null
                    ? 'Esperando su turno…'
                    : showFaceUp
                    ? player.currentDecision === 'APORTO'
                      ? 'Elegido: Aporto (2)'
                      : 'Elegido: No aporto'
                    : 'Tarjeta lista (boca abajo)'}
                </p>
                <p className="mt-0.5 text-[11px] text-[#8DA69B]">
                  {player.cannotAffordContribution
                    ? 'Requiere al menos 2 fichas'
                    : isHaloActive
                    ? 'Decisión secreta: Aporto o No aporto'
                    : canSelectForTurn && player.currentDecision !== null
                    ? 'Clic aquí para cambiar decisión'
                    : 'Se voltea al mismo tiempo'}
                </p>
              </div>
            ) : (
              <div>
                <p
                  className={`text-xs font-semibold ${
                    player.currentDecision === 'APORTO' ? 'text-[#6EE7B7]' : 'text-[#FCA5A5]'
                  }`}
                >
                  {player.currentDecision === 'APORTO'
                    ? 'Aportó 2 fichas'
                    : 'No aportó al fondo'}
                </p>
                {step === 'RESOLUTION' &&
                player.roundOutcome &&
                player.roundOutcome.type !== 'NONE' ? (
                  <p className="mt-1 flex items-start gap-1 text-[11px] leading-snug text-[#E2EBE6]">
                    {isProtected ? (
                      <ShieldCheck
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#34D399]"
                        aria-hidden="true"
                      />
                    ) : isSelfPaid ? (
                      <AlertTriangle
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F87171]"
                        aria-hidden="true"
                      />
                    ) : (
                      <Skull
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F87171]"
                        aria-hidden="true"
                      />
                    )}
                    <span>{player.roundOutcome.summary}</span>
                  </p>
                ) : (
                  <p className="mt-0.5 text-[11px] text-[#8DA69B]">
                    {player.currentDecision === 'APORTO'
                      ? 'Protegido ante accidente'
                      : 'Paga accidente por su cuenta'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Tactile Die */}
        <div
          className="shrink-0"
          onClick={(e) => {
            if (canModeratorEditDie) e.stopPropagation();
          }}
        >
          <TactileDie
            value={player.currentDie}
            isRolling={isDiceRolling && !player.eliminated}
            isEliminated={player.eliminated}
            interactive={canModeratorEditDie}
            onClick={() => onModeratorToggleDie?.(player.id)}
          />
        </div>
      </div>
    </motion.section>
  );
};
