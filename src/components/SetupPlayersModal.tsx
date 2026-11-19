import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, User, Users, X } from 'lucide-react';
import { GameMode, PlayerColorId } from '../game/types';
import { PLAYER_TEMPLATES } from '../game/engine';
import {
  DEFAULT_SEAT_COLORS,
  PLAYER_COLOR_LIST,
  getPlayerColor,
} from '../game/colors';

interface SetupPlayersModalProps {
  mode: GameMode | null;
  initialNames: string[];
  initialColors: PlayerColorId[];
  initialModeratorName: string;
  onCancel: () => void;
  onConfirm: (
    mode: GameMode,
    names: string[],
    colors: PlayerColorId[],
    moderatorName: string
  ) => void;
}

export const SetupPlayersModal: React.FC<SetupPlayersModalProps> = ({
  mode,
  initialNames,
  initialColors,
  initialModeratorName,
  onCancel,
  onConfirm,
}) => {
  const [humanName, setHumanName] = useState<string>('');
  const [humanColor, setHumanColor] = useState<PlayerColorId>('gold');
  const [classNames, setClassNames] = useState<string[]>(
    PLAYER_TEMPLATES.map((p) => p.name)
  );
  const [classColors, setClassColors] = useState<PlayerColorId[]>(DEFAULT_SEAT_COLORS);
  const [moderatorName, setModeratorName] = useState<string>('');

  useEffect(() => {
    if (!mode) return;
    if (mode === 'PLAY_VS_BOTS') {
      const saved = initialNames[0] && initialNames[0] !== 'Ana' ? initialNames[0] : '';
      setHumanName(saved);
      setHumanColor(initialColors[0] ?? DEFAULT_SEAT_COLORS[0]);
    } else if (mode === 'MODERATOR') {
      setClassNames(
        PLAYER_TEMPLATES.map((tpl, idx) => initialNames[idx] ?? tpl.name)
      );
      setClassColors(
        PLAYER_TEMPLATES.map((_, idx) => initialColors[idx] ?? DEFAULT_SEAT_COLORS[idx])
      );
      setModeratorName(initialModeratorName);
    }
  }, [mode, initialNames, initialColors, initialModeratorName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mode) return;

    if (mode === 'PLAY_VS_BOTS') {
      const cleaned = humanName.trim() || 'Tú';
      const botNames = PLAYER_TEMPLATES.slice(1).map((p) => p.name);
      // Ensure bots don't collide with the human's chosen color
      const remainingColors = PLAYER_COLOR_LIST.map((c) => c.id).filter(
        (id) => id !== humanColor
      );
      const botColors = remainingColors.slice(0, 5);
      onConfirm(mode, [cleaned, ...botNames], [humanColor, ...botColors], 'Sistema');
    } else if (mode === 'MODERATOR') {
      const finalNames = classNames.map((n, idx) => n.trim() || `Jugador ${idx + 1}`);
      onConfirm(mode, finalNames, classColors, moderatorName.trim() || 'Moderador');
    }
  };

  const selectedHumanSpec = getPlayerColor(humanColor);

  return (
    <AnimatePresence>
      {mode && mode !== 'GUIDED_DEMO' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Configurar participantes"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/72 backdrop-blur-[2px]"
          />

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#D9A441]/35 bg-[#0A1E17] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-semibold text-[#D9A441]">
                  {mode === 'PLAY_VS_BOTS'
                    ? '1 jugador + 5 rivales automáticos + moderador'
                    : '6 jugadores en vivo + 1 moderador (7 personas)'}
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-[#F5F2EB]">
                  {mode === 'PLAY_VS_BOTS'
                    ? 'Tu nombre y color en la mesa'
                    : 'Nombres y colores de los 6 jugadores'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onCancel}
                aria-label="Cancelar"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#C5D3CC] hover:bg-white/8 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {mode === 'PLAY_VS_BOTS' ? (
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="human-player-name"
                      className="block text-sm font-medium text-[#E2EBE6]"
                    >
                      Tu nombre real
                    </label>
                    <p className="mt-1 text-xs text-[#9BB2A7]">
                      Jugarás contra Beto, Caro, Dani, Eli y Fer. Tu color distinguirá tu asiento,
                      tu halo de turno y tu tarjeta de decisión.
                    </p>
                    <div className="relative mt-3">
                      <User
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D9A441]"
                        aria-hidden="true"
                      />
                      <input
                        id="human-player-name"
                        type="text"
                        maxLength={22}
                        autoFocus
                        value={humanName}
                        onChange={(e) => setHumanName(e.target.value)}
                        placeholder="Escribe tu nombre (ej. Sofía)"
                        className="w-full rounded-xl border border-white/16 bg-[#071611] py-3 pl-10 pr-4 text-sm text-[#F5F2EB] placeholder:text-[#6D877B] focus:border-[#D9A441] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#E2EBE6]">Color distintivo</span>
                      <span className={`font-semibold ${selectedHumanSpec.turnText}`}>
                        {selectedHumanSpec.label}
                      </span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                      {PLAYER_COLOR_LIST.map((col) => {
                        const active = humanColor === col.id;
                        return (
                          <button
                            key={col.id}
                            type="button"
                            onClick={() => setHumanColor(col.id)}
                            aria-label={`Elegir color ${col.label}`}
                            aria-pressed={active}
                            title={col.label}
                            className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F2EB] ${
                              col.swatchBg
                            } ${
                              active
                                ? 'scale-110 ring-2 ring-[#F5F2EB] ring-offset-2 ring-offset-[#0A1E17]'
                                : 'opacity-75 hover:opacity-100 hover:scale-105'
                            }`}
                          >
                            {active && (
                              <Check className="h-4 w-4 text-[#091812]" strokeWidth={3} aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs leading-relaxed text-[#A9BEB4]">
                    Asigna el nombre real y un color distintivo a cada jugador. Ese color se
                    reflejará en su asiento, en su tarjeta de decisión y en el halo brillante cuando
                    sea su turno.
                  </p>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {classNames.map((val, idx) => {
                      const colSpec = getPlayerColor(classColors[idx]);
                      const previewInitials = (val.trim() || `J${idx + 1}`)
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <div
                          key={idx}
                          className={`rounded-xl border bg-[#071611]/90 p-3.5 transition-colors ${colSpec.seatIdleBorder}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <label
                              htmlFor={`class-player-${idx}`}
                              className="flex items-center gap-2 text-xs font-medium text-[#C5D3CC]"
                            >
                              <span
                                className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono-tabular text-[10px] font-bold ${colSpec.monogramClasses}`}
                              >
                                {previewInitials}
                              </span>
                              <span>Jugador {idx + 1}</span>
                            </label>
                            <span className={`text-[11px] font-medium ${colSpec.turnText}`}>
                              {colSpec.label}
                            </span>
                          </div>

                          <input
                            id={`class-player-${idx}`}
                            type="text"
                            maxLength={20}
                            autoFocus={idx === 0}
                            value={val}
                            onChange={(e) => {
                              const next = [...classNames];
                              next[idx] = e.target.value;
                              setClassNames(next);
                            }}
                            placeholder={`Nombre del jugador ${idx + 1}`}
                            className="mt-2.5 w-full rounded-lg border border-white/14 bg-[#0B2019] px-3 py-2 text-sm text-[#F5F2EB] placeholder:text-[#637C71] focus:border-[#D9A441] focus:outline-none"
                          />

                          {/* Color Swatch Row */}
                          <div className="mt-2.5 flex items-center gap-1.5" role="group" aria-label={`Color para Jugador ${idx + 1}`}>
                            {PLAYER_COLOR_LIST.map((col) => {
                              const active = classColors[idx] === col.id;
                              return (
                                <button
                                  key={col.id}
                                  type="button"
                                  onClick={() => {
                                    const next = [...classColors];
                                    next[idx] = col.id;
                                    setClassColors(next);
                                  }}
                                  aria-label={`Color ${col.label} para Jugador ${idx + 1}`}
                                  aria-pressed={active}
                                  title={col.label}
                                  className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#F5F2EB] ${
                                    col.swatchBg
                                  } ${
                                    active
                                      ? 'scale-110 ring-2 ring-[#F5F2EB] ring-offset-1 ring-offset-[#071611]'
                                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                                  }`}
                                >
                                  {active && (
                                    <Check
                                      className="h-3 w-3 text-[#091812]"
                                      strokeWidth={3.2}
                                      aria-hidden="true"
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <label
                      htmlFor="moderator-name"
                      className="flex items-center gap-2 text-xs font-medium text-[#C5D3CC]"
                    >
                      <Users className="h-3.5 w-3.5 text-[#D9A441]" aria-hidden="true" />
                      Persona 7 — Moderador (opcional)
                    </label>
                    <input
                      id="moderator-name"
                      type="text"
                      maxLength={24}
                      value={moderatorName}
                      onChange={(e) => setModeratorName(e.target.value)}
                      placeholder="Nombre del moderador"
                      className="mt-1.5 w-full rounded-lg border border-white/15 bg-[#071611] px-3 py-2.5 text-sm text-[#F5F2EB] placeholder:text-[#637C71] focus:border-[#D9A441] focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-[#C5D3CC] hover:bg-white/6 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D9A441] px-5 py-2.5 text-sm font-semibold text-[#111915] hover:bg-[#E5B55A] cursor-pointer"
              >
                <span>Comenzar partida</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </AnimatePresence>
  );
};
