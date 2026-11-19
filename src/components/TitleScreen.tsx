import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Dices, SlidersHorizontal, Users } from 'lucide-react';
import { GameMode } from '../game/types';
import { TEAM_MEMBERS } from '../game/engine';

interface TitleScreenProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenRules: () => void;
}

const MODES: Array<{
  mode: GameMode;
  index: string;
  title: string;
  subtitle: string;
  detail: string;
  cta: string;
  featured?: boolean;
  icon: React.ReactNode;
}> = [
  {
    mode: 'GUIDED_DEMO',
    index: '01.',
    title: 'Demostración Guiada',
    subtitle: 'Ejemplo oficial de 5 rondas',
    detail:
      'Recorre paso a paso la partida documentada (Ana, Beto, Caro, Dani, Eli y Fer) con narración del moderador: aportes, uso de la reserva, quiebra y reparto a socios fieles.',
    cta: 'Iniciar ejemplo guiado',
    featured: true,
    icon: <BookOpen className="h-5 w-5 text-[#D9A441]" aria-hidden="true" />,
  },
  {
    mode: 'PLAY_VS_BOTS',
    index: '02.',
    title: 'Jugar contra 5 Amigos',
    subtitle: 'Tú contra 5 rivales automáticos',
    detail:
      'Pon tu nombre y elige tu color. En cada ronda decides en secreto si aportas 2 fichas al fondo o te arriesgas por tu cuenta frente a 5 rivales con estrategias distintas.',
    cta: 'Poner mi nombre y jugar',
    icon: <Dices className="h-5 w-5 text-[#6EE7B7]" aria-hidden="true" />,
  },
  {
    mode: 'MODERATOR',
    index: '03.',
    title: 'Mesa de Moderador',
    subtitle: '6 jugadores reales + 1 moderador',
    detail:
      'Ideal para jugar con la clase o amigos en vivo: ingresa los 6 nombres y colores, ilumina el turno de cada jugador para que elija en secreto si aporta o no, y dirige los dados.',
    cta: 'Configurar 6 jugadores',
    icon: <SlidersHorizontal className="h-5 w-5 text-[#C5D3CC]" aria-hidden="true" />,
  },
];

export const TitleScreen: React.FC<TitleScreenProps> = ({ onSelectMode, onOpenRules }) => {
  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-6 py-8 lg:px-10 lg:py-12">
      {/* Centered Hero Title, Serif Subtitle & Justified Prologue */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
      >
        {/* Original Fraunces Display Title in Refined Metallic Gold */}
        <h1 className="font-display title-gold-editorial text-5xl font-semibold leading-[1.06] tracking-[-0.02em] sm:text-6xl lg:text-[4.5rem]">
          Fondo Común
        </h1>

        {/* Normal Editorial Serif Subtitle */}
        <div className="mt-3.5 flex items-center justify-center gap-4">
          <span className="hidden h-px w-10 bg-[#D9A441]/40 sm:block" aria-hidden="true" />
          <p className="font-display text-xl font-normal tracking-wide text-[#EFE8D8] sm:text-2xl">
            Lo que te conviene depende de los demás
          </p>
          <span className="hidden h-px w-10 bg-[#D9A441]/40 sm:block" aria-hidden="true" />
        </div>

        {/* Centered & Justified Synopsis / Prologue */}
        <p className="mx-auto mt-5 max-w-2xl text-justify text-[15px] leading-relaxed text-[#CAD8D1] [text-align-last:center] sm:text-base sm:leading-7">
          Un grupo de seis amigos —guiados por un moderador— reúne un fondo común para protegerse de
          accidentes inesperados. En cada ronda, todos deciden en secreto si aportan 2 fichas o se
          arriesgan por su cuenta antes de que rueden los dados: quien saque 1 sufre un accidente de
          6 fichas. Si todos cooperan, el fondo respalda al grupo entero; si casi nadie aporta, la
          reserva no alcanza.
        </p>

        {/* Clean Unboxed Physical Materials Spec Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/12 pt-4 text-sm text-[#AFC2B9]">
          <span>
            <strong className="font-mono-tabular font-semibold text-[#F5F2EB]">7</strong> personas
            (6 jugadores + 1 moderador)
          </span>
          <span aria-hidden="true" className="text-[#567065]">
            ·
          </span>
          <span>
            <strong className="font-mono-tabular font-semibold text-[#F5F2EB]">72</strong> fichas
            (12 c/u)
          </span>
          <span aria-hidden="true" className="text-[#567065]">
            ·
          </span>
          <span>
            <strong className="font-mono-tabular font-semibold text-[#F5F2EB]">6</strong> dados
          </span>
          <span aria-hidden="true" className="text-[#567065]">
            ·
          </span>
          <span>
            <strong className="font-mono-tabular font-semibold text-[#F5F2EB]">5</strong> rondas
          </span>
          <span aria-hidden="true" className="text-[#567065]">
            ·
          </span>
          <button
            type="button"
            onClick={onOpenRules}
            className="font-medium text-[#F6DC99] underline underline-offset-4 hover:text-white cursor-pointer"
          >
            Leer reglas completas
          </button>
        </div>
      </motion.div>

      {/* 3-Column Mode Selector */}
      <section aria-label="Modos de demostración" className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
        {MODES.map((item, idx) => (
          <motion.div
            key={item.mode}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 * (idx + 1), ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col justify-between rounded-2xl border p-6 transition-colors ${
              item.featured
                ? 'border-[#D9A441]/55 bg-[#0D251D]/92 shadow-[0_14px_38px_rgba(0,0,0,0.4)]'
                : 'border-white/12 bg-[#0A1F18]/86 hover:border-[#D9A441]/35'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono-tabular text-xs font-semibold text-[#9BB2A7]">
                  {item.index} {item.subtitle}
                </span>
                {item.icon}
              </div>

              <h2 className="mt-3 font-display text-2xl font-semibold text-[#F5F2EB]">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#BCCBC4]">{item.detail}</p>
            </div>

            <div className="mt-6 pt-2">
              <button
                type="button"
                onClick={() => onSelectMode(item.mode)}
                className={`inline-flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-transform duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A441] whitespace-nowrap cursor-pointer ${
                  item.featured
                    ? 'bg-[#D9A441] text-[#111915] hover:bg-[#E5B55A]'
                    : 'border border-white/18 bg-[#122D24] text-[#F5F2EB] hover:bg-[#193B30]'
                }`}
              >
                <span>{item.cta}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Quiet Academic & Team Attribution Footer */}
      <footer className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-[#8CA499] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 font-medium text-[#C5D3CC]">
          <Users className="h-3.5 w-3.5 text-[#D9A441]" aria-hidden="true" />
          <span>Tercer Parcial · Juego de Coordinación · Equipo GMMB</span>
        </div>
        <p className="leading-relaxed">{TEAM_MEMBERS.join(' · ')}</p>
      </footer>
    </main>
  );
};
