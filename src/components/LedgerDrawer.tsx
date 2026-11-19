import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { LedgerEntry } from '../game/types';

interface LedgerDrawerProps {
  open: boolean;
  entries: LedgerEntry[];
  onClose: () => void;
}

export const LedgerDrawer: React.FC<LedgerDrawerProps> = ({ open, entries, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Registro de rondas">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-[#D9A441]/25 bg-[#091D16] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#F5F2EB]">
                  Registro de Rondas
                </h2>
                <p className="mt-0.5 text-xs text-[#9BB2A7]">
                  Bitácora en vivo de aportes, accidentes y evolución del fondo común
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar registro"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#C5D3CC] hover:bg-white/8 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {entries.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 px-6 text-center">
                  <p className="text-sm font-medium text-[#D6E2DC]">
                    Aún no se ha completado ninguna ronda.
                  </p>
                  <p className="mt-1 text-xs text-[#8DA69B]">
                    Conforme avance la partida, aquí aparecerá el desglose exacto de cada ronda.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/12 bg-[#0D261D] text-[#A9BEB4]">
                        <th className="px-3.5 py-3 font-semibold whitespace-nowrap">Ronda</th>
                        <th className="px-3.5 py-3 font-semibold">Quién aporta</th>
                        <th className="px-3.5 py-3 font-semibold text-right whitespace-nowrap">
                          Tras aportes
                        </th>
                        <th className="px-3.5 py-3 font-semibold">Accidentes</th>
                        <th className="px-3.5 py-3 font-semibold">Qué pasa</th>
                        <th className="px-3.5 py-3 font-semibold text-right whitespace-nowrap">
                          Fondo final
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8">
                      {entries.map((row) => (
                        <tr key={row.round} className="align-top hover:bg-white/[0.02]">
                          <td className="px-3.5 py-3 font-mono-tabular font-semibold text-[#F6DC99]">
                            {row.round}
                          </td>
                          <td className="px-3.5 py-3 text-[#E2EBE6]">{row.contributorsLabel}</td>
                          <td className="px-3.5 py-3 font-mono-tabular text-right text-[#E2EBE6] whitespace-nowrap">
                            {row.fundBefore > 0
                              ? `${row.fundBefore} + ${row.roundInflow} = ${row.fundAfterContributions}`
                              : row.fundAfterContributions}
                          </td>
                          <td
                            className={`px-3.5 py-3 font-medium ${
                              row.accidentsNames.length > 0 ? 'text-[#FCA5A5]' : 'text-[#8DA69B]'
                            }`}
                          >
                            {row.accidentsLabel}
                          </td>
                          <td className="px-3.5 py-3 leading-relaxed text-[#C5D3CC]">
                            {row.whatHappened}
                          </td>
                          <td className="px-3.5 py-3 font-mono-tabular text-right font-bold text-[#F6DC99]">
                            {row.fundFinal}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
