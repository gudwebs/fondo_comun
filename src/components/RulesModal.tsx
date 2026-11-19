import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { TEAM_MEMBERS } from '../game/engine';

interface RulesModalProps {
  open: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ open, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Reglas del juego"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/68 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#D9A441]/30 bg-[#0A1E17] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#F5F2EB]">
                  Reglas de Fondo Común
                </h2>
                <p className="mt-0.5 text-xs text-[#9BB2A7]">
                  Guía completa de preparación, rondas y puntuación
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar reglas"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#C5D3CC] hover:bg-white/8 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5 text-sm leading-relaxed text-[#D0DDD7]">
              <section>
                <h3 className="font-display text-base font-semibold text-[#F6DC99]">
                  1. El dilema de coordinación
                </h3>
                <p className="mt-1.5">
                  Un grupo de 6 amigos crea un fondo para protegerse de accidentes. En cada ronda,
                  cada jugador decide en secreto si aporta al fondo o se arriesga por su cuenta. Si
                  casi nadie aporta, el fondo no alcanza y aportar sirve de poco; si todos aportan,
                  todos quedan protegidos.
                </p>
              </section>

              <section className="border-t border-white/8 pt-5">
                <h3 className="font-display text-base font-semibold text-[#F6DC99]">
                  2. Participantes, materiales y duración
                </h3>
                <p className="mt-1.5">
                  Participan{' '}
                  <strong className="font-mono-tabular text-[#F5F2EB]">7 personas en total</strong>:
                  6 jugadores y 1 moderador que dirige cada paso y administra el bote central. Cada
                  jugador comienza con{' '}
                  <strong className="font-mono-tabular text-[#F5F2EB]">12 fichas</strong> (72 en
                  total). El juego dura exactamente{' '}
                  <strong className="font-mono-tabular text-[#F5F2EB]">5 rondas</strong>, y cada
                  ronda sigue 4 pasos ordenados:
                </p>
                <ol className="mt-3 space-y-2 pl-4 list-decimal text-[#C5D3CC]">
                  <li>
                    <strong className="text-[#F5F2EB]">Decisión secreta:</strong> cada jugador pone
                    boca abajo su tarjeta de <em>APORTO</em> o <em>NO APORTO</em>, y todos las
                    voltean al mismo tiempo.
                  </li>
                  <li>
                    <strong className="text-[#F5F2EB]">Pago:</strong> quien aportó mete{' '}
                    <span className="font-mono-tabular text-[#F6DC99]">2 fichas</span> al bote del
                    fondo común.
                  </li>
                  <li>
                    <strong className="text-[#F5F2EB]">Dados:</strong> cada jugador activo tira un
                    dado. Si sale <span className="font-mono-tabular text-[#FCA5A5]">1</span>, sufre
                    un accidente que cuesta{' '}
                    <span className="font-mono-tabular text-[#FCA5A5]">6 fichas</span>.
                  </li>
                  <li>
                    <strong className="text-[#F5F2EB]">Pago del accidente:</strong> si aportaste en
                    esta ronda, el fondo paga tus 6 fichas. Si no aportaste, las pagas tú. Si el
                    fondo no alcanza, se reparte en partes iguales lo que haya entre los accidentados
                    asegurados y cada uno paga lo que falte.
                  </li>
                </ol>
              </section>

              <section className="border-t border-white/8 pt-5">
                <h3 className="font-display text-base font-semibold text-[#F6DC99]">
                  3. Reserva y quiebra
                </h3>
                <ul className="mt-2 space-y-1.5 text-[#C5D3CC]">
                  <li>
                    <strong className="text-[#F5F2EB]">Reserva:</strong> lo que sobra en el fondo al
                    cerrar una ronda se queda ahí acumulado para las siguientes rondas.
                  </li>
                  <li>
                    <strong className="text-[#F5F2EB]">Quiebra:</strong> si te toca pagar y no
                    tienes fichas suficientes, quedas eliminado del juego y no puedes ganar.
                  </li>
                </ul>
              </section>

              <section className="border-t border-white/8 pt-5">
                <h3 className="font-display text-base font-semibold text-[#F6DC99]">
                  4. Puntos finales y socios fieles
                </h3>
                <p className="mt-1.5">
                  Cada ficha vale <strong className="font-mono-tabular text-[#F5F2EB]">1 punto</strong>.
                  Al terminar la ronda 5, el fondo restante se reparte en partes iguales{' '}
                  <strong className="text-[#F5F2EB]">
                    solo entre quienes aportaron en las 5 rondas
                  </strong>{' '}
                  (los <em>socios fieles</em>). Si la división no es exacta, el sobrante se queda en
                  el fondo. Gana quien acumule más puntos finales; en caso de empate se comparte la
                  victoria.
                </p>
              </section>

              <section className="border-t border-white/8 pt-4 text-xs text-[#8CA499] space-y-1">
                <p className="font-medium text-[#C5D3CC]">
                  Tercer Parcial · Juego de Coordinación · Equipo GMMB
                </p>
                <p>Integrantes: {TEAM_MEMBERS.join(', ')}.</p>
              </section>
            </div>

            <div className="flex justify-end border-t border-white/10 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-[#D9A441] px-5 py-2 text-sm font-semibold text-[#111915] hover:bg-[#E5B55A] cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
