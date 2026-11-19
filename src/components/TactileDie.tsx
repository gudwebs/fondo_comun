import React from 'react';
import { motion } from 'motion/react';

interface TactileDieProps {
  value: number | null;
  isRolling: boolean;
  isEliminated: boolean;
  interactive?: boolean;
  onClick?: () => void;
  title?: string;
}

const PIP_POSITIONS: Record<number, Array<[number, number]>> = {
  1: [[50, 50]],
  2: [
    [28, 28],
    [72, 72],
  ],
  3: [
    [28, 28],
    [50, 50],
    [72, 72],
  ],
  4: [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
  5: [
    [28, 28],
    [72, 28],
    [50, 50],
    [28, 72],
    [72, 72],
  ],
  6: [
    [28, 25],
    [72, 25],
    [28, 50],
    [72, 50],
    [28, 75],
    [72, 75],
  ],
};

export const TactileDie: React.FC<TactileDieProps> = ({
  value,
  isRolling,
  isEliminated,
  interactive = false,
  onClick,
  title,
}) => {
  const isAccident = value === 1 && !isRolling;
  const pips = value ? PIP_POSITIONS[value] ?? [] : [];

  const body = (
    <motion.div
      animate={
        isRolling
          ? {
              rotate: [0, -14, 16, -10, 12, 0],
              scale: [1, 1.08, 0.96, 1.06, 1],
            }
          : isAccident
          ? {
              scale: [1, 1.12, 1],
            }
          : { rotate: 0, scale: 1 }
      }
      transition={
        isRolling
          ? { duration: 0.45, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
      }
      className={`relative flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
        isEliminated
          ? 'border border-white/10 bg-black/25 opacity-35'
          : value === null && !isRolling
          ? 'border border-dashed border-[#D9A441]/30 bg-[#0A1F18]/70'
          : isAccident
          ? 'border-2 border-[#EF4444] bg-[#FEF2F2] shadow-[0_6px_18px_rgba(220,38,38,0.42)]'
          : 'border border-[#D7CFC0] bg-[#FAF6ED] shadow-[0_5px_14px_rgba(0,0,0,0.42)]'
      }`}
    >
      {isEliminated ? (
        <span className="font-mono-tabular text-xs text-[#9BB0A6]">—</span>
      ) : value === null && !isRolling ? (
        <span className="font-mono-tabular text-xs font-medium text-[#8EA69B]">?</span>
      ) : (
        <svg viewBox="0 0 100 100" className="h-full w-full p-1.5" aria-hidden="true">
          {pips.map(([cx, cy], idx) => (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={value === 1 ? 14 : 9.5}
              fill={isAccident ? '#DC2626' : '#18241E'}
            />
          ))}
        </svg>
      )}
    </motion.div>
  );

  if (interactive && !isEliminated && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title ?? 'Clic para alternar accidente (1)'}
        className="group relative flex flex-col items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A441] cursor-pointer"
      >
        {body}
        <span className="text-[11px] font-medium text-[#D9A441] opacity-85 group-hover:opacity-100 whitespace-nowrap">
          {isAccident ? 'Accidente' : 'Forzar 1'}
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1" title={title}>
      {body}
      <span
        className={`text-[11px] font-medium whitespace-nowrap ${
          isAccident
            ? 'text-[#FCA5A5]'
            : value !== null && !isRolling
            ? 'text-[#A9BEB4]'
            : 'text-[#6F897E]'
        }`}
      >
        {isEliminated
          ? 'Fuera'
          : isRolling
          ? 'Tirando…'
          : value === null
          ? 'Dado'
          : isAccident
          ? 'Accidente'
          : `Salió ${value}`}
      </span>
    </div>
  );
};
