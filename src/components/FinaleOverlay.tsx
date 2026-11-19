import React from 'react';
import { motion } from 'motion/react';
import { Award, RotateCcw, Skull, Table2, Trophy } from 'lucide-react';
import { FinalSummary, GameMode } from '../game/types';
import { TOTAL_ROUNDS, formatNameList } from '../game/engine';

interface FinaleOverlayProps {
  summary: FinalSummary;
  mode: GameMode;
  onPlayAgain: () => void;
  onOpenLedger: () => void;
  onGoHome: () => void;
}

export const FinaleOverlay: React.FC<FinaleOverlayProps> = ({
  summary,
  mode,
  onPlayAgain,
  onOpenLedger,
  onGoHome,
}) => {
  const winnerNames = formatNameList(summary.winners.map((w) => w.name));

  const insightText =
    summary.faithfulCount >= 3 && summary.sharePerFaithful >= 4
      ? 'La cooperación sostenida mantuvo el fondo solvente durante las 5 rondas y recompensó a los socios fieles con el reparto de la reserva final.'
      : summary.faithfulCount === 0
      ? 'Ningún jugador logró mantenerse como socio fiel durante las 5 rondas, por lo que toda la reserva final se quedó sin repartir en el fondo.'
      : 'Cuando pocos jugadores sostienen el fondo, el dilema de coordinación se tensa: arriesgarse puede ahorrar fichas al inicio, pero expone a quiebras ante un 1 en el dado.';

  return (
    <main className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col justify-center px-6 py-8 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-[#D9A441]/38 bg-[#0A1E17]/94 p-6 sm:p-8 shadow-[0_20px_54px_rgba(0,0,0,0.55)]"
      >
        {/* Header Victory Proclamation */}
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-[#D9A441]">
              Fin de la Ronda {TOTAL_ROUNDS} ·{' '}
              {mode === 'GUIDED_DEMO'
                ? 'Ejemplo oficial completado'
                : 'Resultados oficiales'}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-[#F5F2EB] sm:text-4xl">
              {summary.winners.length === 0
                ? 'Todos los jugadores quedaron eliminados'
                : summary.isTie
                ? `Victoria compartida: ${winnerNames}`
                : `Ganador: ${winnerNames}`}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#C5D3CC]">
              {insightText}
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D9A441]/45 bg-[#122D24]">
            <Trophy className="h-7 w-7 text-[#F6DC99]" aria-hidden="true" />
          </div>
        </div>

        {/* Faithful Partner Fund Split Equation Strip */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-b border-white/10 pb-6 sm:grid-cols-3">
          <div>
            <span className="text-xs text-[#9BB2A7]">Fondo al cierre de Ronda 5</span>
            <p className="mt-1 font-mono-tabular text-2xl font-bold text-[#F6DC99]">
              {summary.fundBeforeDistribution} fichas
            </p>
          </div>
          <div>
            <span className="text-xs text-[#9BB2A7]">Socios fieles (5 de 5 aportes)</span>
            <p className="mt-1 font-mono-tabular text-2xl font-bold text-[#F5F2EB]">
              {summary.faithfulCount}{' '}
              <span className="text-sm font-normal text-[#9BB2A7]">
                {summary.faithfulCount === 1 ? 'jugador' : 'jugadores'}
              </span>
            </p>
          </div>
          <div>
            <span className="text-xs text-[#9BB2A7]">Reparto por socio fiel</span>
            <p className="mt-1 font-mono-tabular text-2xl font-bold text-[#6EE7B7]">
              +{summary.sharePerFaithful} fichas
            </p>
            {summary.leftoverFund > 0 && (
              <p className="mt-0.5 text-xs text-[#8DA69B]">
                Sobrante en fondo: <span className="font-mono-tabular">{summary.leftoverFund}</span>
              </p>
            )}
          </div>
        </div>

        {/* Ranked Final Scoreboard Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/12 text-xs text-[#9BB2A7]">
                <th className="py-3 pr-4 font-semibold">Jugador</th>
                <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Aportes</th>
                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">
                  Fichas propias
                </th>
                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">
                  Parte del fondo
                </th>
                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">
                  Puntos finales
                </th>
                <th className="py-3 pl-4 font-semibold text-right whitespace-nowrap">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {summary.results.map((row) => {
                const contributions = row.player.contributionHistory.filter((v) => v === true).length;
                return (
                  <tr
                    key={row.player.id}
                    className={
                      row.isWinner
                        ? 'bg-[#D9A441]/10'
                        : row.player.eliminated
                        ? 'opacity-55'
                        : ''
                    }
                  >
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base font-semibold text-[#F5F2EB]">
                          {row.player.name}
                        </span>
                        {row.isFaithful && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#F6DC99]">
                            <Award className="h-3.5 w-3.5" aria-hidden="true" />
                            Socio fiel
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono-tabular text-[#C5D3CC]">
                      {contributions}/{TOTAL_ROUNDS}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono-tabular text-[#E2EBE6]">
                      {row.player.eliminated ? '—' : row.player.chips}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono-tabular text-[#6EE7B7]">
                      {row.fundShare > 0 ? `+${row.fundShare}` : '0'}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono-tabular text-base font-bold text-[#F6DC99]">
                      {row.player.eliminated ? '—' : row.finalPoints}
                    </td>
                    <td className="py-3.5 pl-4 text-right text-xs font-semibold whitespace-nowrap">
                      {row.player.eliminated ? (
                        <span className="inline-flex items-center gap-1 text-[#FCA5A5]">
                          <Skull className="h-3.5 w-3.5" aria-hidden="true" />
                          Eliminado (R{row.player.eliminatedRound})
                        </span>
                      ) : row.isWinner ? (
                        <span className="text-[#F6DC99]">
                          {summary.isTie ? 'Victoria compartida' : 'Ganador'}
                        </span>
                      ) : (
                        <span className="text-[#8DA69B]">Sobrevivió</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={onOpenLedger}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#10261E] px-4 py-2.5 text-sm font-medium text-[#E2EBE6] hover:bg-[#16342A] whitespace-nowrap cursor-pointer"
          >
            <Table2 className="h-4 w-4 text-[#D9A441]" aria-hidden="true" />
            Ver tabla completa de rondas
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onGoHome}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-[#C5D3CC] hover:bg-white/6 hover:text-white whitespace-nowrap cursor-pointer"
            >
              Cambiar modo
            </button>
            <button
              type="button"
              onClick={onPlayAgain}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D9A441] px-5 py-2.5 text-sm font-semibold text-[#111915] hover:bg-[#E5B55A] whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Jugar de nuevo
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
