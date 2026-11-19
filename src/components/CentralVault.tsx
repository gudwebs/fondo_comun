import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChipTransfer, RoundStep } from '../game/types';

const VAULT_IMAGE = '/src/assets/images/vault_vessel_emblem_1795110217226.jpg';

interface CentralVaultProps {
  fund: number;
  reserveBeforeRound: number;
  roundInflow: number;
  round: number;
  totalRounds: number;
  step: RoundStep;
  activeTransfers: ChipTransfer[];
}

// Approximate unit vectors from center to each of the 6 seat zones
// Top row: seats 0 (left), 1 (center), 2 (right)
// Bottom row: seats 3 (left), 4 (center), 5 (right)
const SEAT_VECTORS: Record<number, { x: number; y: number }> = {
  0: { x: -240, y: -135 },
  1: { x: 0, y: -155 },
  2: { x: 240, y: -135 },
  3: { x: -240, y: 135 },
  4: { x: 0, y: 155 },
  5: { x: 240, y: 135 },
};

// Deterministic cozy spiral positions for gold chips inside the bowl
function getChipPosition(index: number): { x: number; y: number } {
  const angle = index * 2.39996; // Golden angle
  const radius = Math.min(44, 6 + Math.sqrt(index) * 8.5);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export const CentralVault: React.FC<CentralVaultProps> = ({
  fund,
  reserveBeforeRound,
  roundInflow,
  round,
  totalRounds,
  step,
  activeTransfers,
}) => {
  const [vaultImgError, setVaultImgError] = useState(false);
  const displayedChips = Math.min(fund, 32);

  return (
    <div className="relative flex flex-col items-center justify-center py-3">
      {/* Flying Chip Transfer Layer */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible">
        <AnimatePresence>
          {activeTransfers.map((tr, idx) => {
            const isInbound = tr.toSeat === 'VAULT';
            const seatIdx = isInbound ? (tr.fromSeat as number) : (tr.toSeat as number);
            const vec = SEAT_VECTORS[seatIdx] ?? { x: 0, y: -140 };
            return (
              <motion.div
                key={tr.id}
                initial={{
                  x: isInbound ? vec.x : 0,
                  y: isInbound ? vec.y : 0,
                  scale: 0.7,
                  opacity: 0,
                }}
                animate={{
                  x: isInbound ? 0 : vec.x,
                  y: isInbound ? 0 : vec.y,
                  scale: [0.85, 1.15, 0.9],
                  opacity: [0, 1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.68,
                  delay: idx * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute flex items-center gap-1"
              >
                <span className="gold-chip gold-chip-ring flex h-7 w-7 items-center justify-center rounded-full font-mono-tabular text-[11px] font-bold text-[#2B1B04]">
                  {isInbound ? `+${tr.amount}` : tr.amount}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Center Tabletop Medallion + Bowl */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
        {/* Left Readout: Round & Reserve */}
        <div className="order-2 flex flex-col items-center sm:order-1 sm:items-end text-center sm:text-right min-w-[140px]">
          <span className="text-xs font-medium text-[#9BB2A7]">Progreso de partida</span>
          <p className="mt-0.5 font-display text-2xl font-semibold text-[#F5F2EB]">
            Ronda <span className="font-mono-tabular">{round}</span> de{' '}
            <span className="font-mono-tabular">{totalRounds}</span>
          </p>
          <p className="mt-1 text-xs text-[#9BB2A7]">
            Reserva inicial: <span className="font-mono-tabular font-semibold text-[#E2EBE6]">{reserveBeforeRound}</span>
          </p>
        </div>

        {/* Hammered Brass Bowl Focal Anchor */}
        <motion.div
          key={fund}
          initial={{ scale: 0.97 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 relative flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center rounded-full shadow-[0_18px_45px_rgba(0,0,0,0.58)] ring-1 ring-[#D9A441]/35 sm:order-2"
        >
          {/* Bowl Artwork */}
          <div className="absolute inset-0 overflow-hidden rounded-full bg-[#141715]">
            {!vaultImgError ? (
              <img
                src={VAULT_IMAGE}
                alt="Bote del fondo común"
                referrerPolicy="no-referrer"
                onError={() => setVaultImgError(true)}
                className="h-full w-full object-cover scale-[1.52]"
              />
            ) : (
              <div className="h-full w-full rounded-full border-4 border-[#9C7329] bg-radial from-[#1F2421] via-[#121614] to-[#0B0E0D]" />
            )}
          </div>

          {/* Accumulated Gold Chips inside Bowl */}
          <div className="relative z-10 flex h-24 w-24 items-center justify-center">
            <AnimatePresence>
              {Array.from({ length: displayedChips }).map((_, i) => {
                const pos = getChipPosition(i);
                return (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, x: pos.x, y: pos.y }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="gold-chip gold-chip-ring absolute h-4 w-4 rounded-full"
                    aria-hidden="true"
                  />
                );
              })}
            </AnimatePresence>

            {/* Center Crisp Fund Counter Scrim */}
            <div className="relative z-20 flex flex-col items-center justify-center rounded-full bg-[#091511]/82 px-3.5 py-2 backdrop-blur-[2px] ring-1 ring-[#D9A441]/45">
              <span className="font-mono-tabular text-3xl font-bold leading-none text-[#F6DC99]">
                {fund}
              </span>
              <span className="mt-0.5 text-[10px] font-medium text-[#D6E2DC]">
                {fund === 1 ? 'ficha' : 'fichas'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Readout: Fund Status */}
        <div className="order-3 flex flex-col items-center sm:items-start text-center sm:text-left min-w-[140px]">
          <span className="text-xs font-medium text-[#9BB2A7]">Bote central</span>
          <p className="mt-0.5 font-display text-2xl font-semibold text-[#F6DC99]">
            Fondo Común
          </p>
          <p className="mt-1 text-xs text-[#9BB2A7]">
            {step === 'DECISION' || step === 'REVEAL'
              ? 'Esperando aportes (2 c/u)'
              : roundInflow > 0
              ? `Aportado esta ronda: +${roundInflow}`
              : 'Sin aportes esta ronda'}
          </p>
        </div>
      </div>
    </div>
  );
};
