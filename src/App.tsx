import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CONTRIBUTION_COST,
  GUIDED_DEMO_SCRIPT,
  PLAYER_TEMPLATES,
  TOTAL_ROUNDS,
  chooseBotDecision,
  computeFinalSummary,
  createInitialPlayers,
  describeContributors,
  formatNameList,
  resolveRoundAccidents,
  rollFairDie,
} from './game/engine';
import {
  ChipTransfer,
  Decision,
  GameMode,
  LedgerEntry,
  PlayerColorId,
  PlayerState,
  RoundStep,
  ScreenState,
} from './game/types';
import { DEFAULT_SEAT_COLORS } from './game/colors';
import { tabletopAudio } from './utils/sound';
import { TopBar } from './components/TopBar';
import { TitleScreen } from './components/TitleScreen';
import { PlayerSeat } from './components/PlayerSeat';
import { CentralVault } from './components/CentralVault';
import { ModeratorBar } from './components/ModeratorBar';
import { LedgerDrawer } from './components/LedgerDrawer';
import { RulesModal } from './components/RulesModal';
import { FinaleOverlay } from './components/FinaleOverlay';
import { SetupPlayersModal } from './components/SetupPlayersModal';

const FELT_BG_IMAGE = '/src/assets/images/table_felt_surface_1795110217899.jpg';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('TITLE');
  const [mode, setMode] = useState<GameMode>('GUIDED_DEMO');
  const [setupMode, setSetupMode] = useState<GameMode | null>(null);
  const [customNames, setCustomNames] = useState<string[]>(
    PLAYER_TEMPLATES.map((p) => p.name)
  );
  const [customColors, setCustomColors] = useState<PlayerColorId[]>(DEFAULT_SEAT_COLORS);
  const [moderatorName, setModeratorName] = useState<string>('Moderador');

  const [round, setRound] = useState<number>(1);
  const [step, setStep] = useState<RoundStep>('DECISION');

  const [players, setPlayers] = useState<PlayerState[]>(() => createInitialPlayers('GUIDED_DEMO'));
  const [activeTurnPlayerId, setActiveTurnPlayerId] = useState<string | null>(null);
  const [fund, setFund] = useState<number>(0);
  const [reserveBeforeRound, setReserveBeforeRound] = useState<number>(0);
  const [roundInflow, setRoundInflow] = useState<number>(0);
  const [commentary, setCommentary] = useState<string>('');
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [activeTransfers, setActiveTransfers] = useState<ChipTransfer[]>([]);

  const [isDiceRolling, setIsDiceRolling] = useState<boolean>(false);
  const [moderatorPeek, setModeratorPeek] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);
  const [ledgerOpen, setLedgerOpen] = useState<boolean>(false);
  const [bgError, setBgError] = useState<boolean>(false);

  const rollIntervalRef = useRef<number | null>(null);
  const rollTimeoutRef = useRef<number | null>(null);
  const transferTimeoutRef = useRef<number | null>(null);

  const clearAllTimers = useCallback(() => {
    if (rollIntervalRef.current !== null) {
      window.clearInterval(rollIntervalRef.current);
      rollIntervalRef.current = null;
    }
    if (rollTimeoutRef.current !== null) {
      window.clearTimeout(rollTimeoutRef.current);
      rollTimeoutRef.current = null;
    }
    if (transferTimeoutRef.current !== null) {
      window.clearTimeout(transferTimeoutRef.current);
      transferTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const prepareRound = useCallback(
    (
      nextRound: number,
      basePlayers: PlayerState[],
      currentFund: number,
      activeMode: GameMode,
      lastParticipationRate: number
    ) => {
      clearAllTimers();
      setIsDiceRolling(false);
      setActiveTransfers([]);
      setRound(nextRound);
      setStep('DECISION');
      setReserveBeforeRound(currentFund);
      setRoundInflow(0);
      setModeratorPeek(false);

      const script = activeMode === 'GUIDED_DEMO' ? GUIDED_DEMO_SCRIPT[nextRound - 1] : null;

      const preparedPlayers = basePlayers.map((p) => {
        if (p.eliminated) {
          return {
            ...p,
            currentDecision: null,
            cannotAffordContribution: false,
            currentDie: null,
            hadAccident: false,
            roundOutcome: null,
            lastDelta: null,
          };
        }

        const cannotAfford = p.chips < CONTRIBUTION_COST;
        let decision: Decision | null = null;

        if (activeMode === 'GUIDED_DEMO' && script) {
          decision = cannotAfford ? 'NO_APORTO' : script.decisions[p.id] ?? 'APORTO';
        } else if (activeMode === 'PLAY_VS_BOTS') {
          if (p.isHuman) {
            decision = cannotAfford ? 'NO_APORTO' : null;
          } else {
            decision = chooseBotDecision(p, nextRound, currentFund, lastParticipationRate);
          }
        } else {
          // MODERATOR mode: each active affordable player takes their secret turn one by one
          decision = cannotAfford ? 'NO_APORTO' : null;
        }

        return {
          ...p,
          currentDecision: decision,
          cannotAffordContribution: cannotAfford,
          currentDie: null,
          hadAccident: false,
          roundOutcome: null,
          lastDelta: null,
        };
      });

      setPlayers(preparedPlayers);

      if (activeMode === 'GUIDED_DEMO' && script) {
        setActiveTurnPlayerId(null);
        setCommentary(script.decisionNote);
      } else if (activeMode === 'PLAY_VS_BOTS') {
        const human = preparedPlayers.find((p) => p.isHuman);
        if (human && !human.eliminated && !human.cannotAffordContribution) {
          setActiveTurnPlayerId(human.id);
          setCommentary(
            `Ronda ${nextRound} — Tu turno, ${human.name}: los otros 5 jugadores ya pusieron su tarjeta boca abajo. Decide en secreto si aportas 2 fichas al fondo o vas por tu cuenta.`
          );
        } else {
          setActiveTurnPlayerId(null);
          if (human?.eliminated) {
            setCommentary(
              `Ronda ${nextRound}: Quedaste eliminado, pero tus compañeros siguen jugando. Pulsa "Voltear tarjetas" para ver su decisión.`
            );
          } else {
            setCommentary(
              `Ronda ${nextRound}: Tienes menos de 2 fichas y no puedes aportar. Pulsa "Voltear tarjetas" para revelar las decisiones.`
            );
          }
        }
      } else {
        // MODERATOR mode: spotlight the first active player who needs to decide
        const firstPending = preparedPlayers.find(
          (p) => !p.eliminated && !p.cannotAffordContribution && p.currentDecision === null
        );
        if (firstPending) {
          setActiveTurnPlayerId(firstPending.id);
          setCommentary(
            `Ronda ${nextRound} — Turno secreto de ${firstPending.name}: elige si aportas 2 fichas al fondo o no aportas. La tarjeta quedará boca abajo hasta que todos elijan.`
          );
        } else {
          setActiveTurnPlayerId(null);
          setCommentary(
            `Ronda ${nextRound}: Ningún jugador activo tiene fichas suficientes para aportar. Pulsa "Voltear tarjetas" para continuar.`
          );
        }
      }
    },
    [clearAllTimers]
  );

  const launchGame = useCallback(
    (
      selectedMode: GameMode,
      namesForMode?: string[],
      colorsForMode?: PlayerColorId[],
      modName?: string
    ) => {
      const resolvedNames = namesForMode ?? customNames;
      const resolvedColors = colorsForMode ?? customColors;
      if (namesForMode) setCustomNames(namesForMode);
      if (colorsForMode) setCustomColors(colorsForMode);
      if (modName !== undefined) setModeratorName(modName);

      const freshPlayers = createInitialPlayers(
        selectedMode,
        selectedMode === 'GUIDED_DEMO' ? undefined : resolvedNames,
        selectedMode === 'GUIDED_DEMO' ? undefined : resolvedColors
      );
      setMode(selectedMode);
      setFund(0);
      setLedger([]);
      setSetupMode(null);
      setScreen('TABLE');
      prepareRound(1, freshPlayers, 0, selectedMode, 0.85);
      tabletopAudio.playCardSelect();
    },
    [customNames, customColors, prepareRound]
  );

  const handleSelectModeFromTitle = useCallback(
    (selectedMode: GameMode) => {
      if (selectedMode === 'GUIDED_DEMO') {
        launchGame('GUIDED_DEMO');
      } else {
        setSetupMode(selectedMode);
      }
    },
    [launchGame]
  );

  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      tabletopAudio.enabled = next;
      return next;
    });
  }, []);

  const handlePlayerDecision = useCallback(
    (playerId: string, decision: Decision) => {
      tabletopAudio.playCardSelect();

      const updated = players.map((p) =>
        p.id === playerId && !p.eliminated ? { ...p, currentDecision: decision } : p
      );
      setPlayers(updated);

      if (mode === 'PLAY_VS_BOTS') {
        const actor = updated.find((p) => p.id === playerId);
        setActiveTurnPlayerId(null);
        setCommentary(
          decision === 'APORTO'
            ? `Ronda ${round}: ${actor?.name ?? 'Elegiste'} colocó APORTO (2 fichas). Pulsa "Voltear tarjetas" para revelar todas las decisiones al mismo tiempo.`
            : `Ronda ${round}: ${actor?.name ?? 'Elegiste'} colocó NO APORTO. Pulsa "Voltear tarjetas" para ver qué decidieron los demás.`
        );
      } else if (mode === 'MODERATOR') {
        // Advance spotlight to the next active player who hasn't chosen yet
        const currentIdx = updated.findIndex((p) => p.id === playerId);
        const orderedAfter = [
          ...updated.slice(currentIdx + 1),
          ...updated.slice(0, currentIdx),
        ];
        const nextPending = orderedAfter.find(
          (p) => !p.eliminated && !p.cannotAffordContribution && p.currentDecision === null
        );

        const actor = updated.find((p) => p.id === playerId);

        if (nextPending) {
          setActiveTurnPlayerId(nextPending.id);
          setCommentary(
            `Decisión de ${actor?.name ?? 'jugador'} guardada en secreto. Ahora es el turno de ${nextPending.name}: elige si aportas 2 fichas o no aportas.`
          );
        } else {
          setActiveTurnPlayerId(null);
          setCommentary(
            `¡Todos los jugadores colocaron su tarjeta boca abajo! Pulsa "Voltear tarjetas" para revelar las decisiones al mismo tiempo (o haz clic en algún jugador si necesita cambiar antes de voltear).`
          );
        }
      }
    },
    [players, mode, round]
  );

  const handleSelectSeatForTurn = useCallback(
    (playerId: string) => {
      if (mode !== 'MODERATOR' || step !== 'DECISION') return;
      const target = players.find((p) => p.id === playerId);
      if (!target || target.eliminated || target.cannotAffordContribution) return;
      tabletopAudio.playCardSelect();
      setActiveTurnPlayerId(playerId);
      setCommentary(
        `Ronda ${round} — Turno de ${target.name}: selecciona "Aportar (2 fichas)" o "No aportar" para guardar su tarjeta en secreto.`
      );
    },
    [mode, step, players, round]
  );

  const handleModeratorToggleDie = useCallback(
    (playerId: string) => {
      if (mode !== 'MODERATOR' || step !== 'DICE' || isDiceRolling) return;
      tabletopAudio.playCardSelect();
      const next = players.map((p) => {
        if (p.id !== playerId || p.eliminated) return p;
        const nextDie = p.currentDie === 1 ? 4 : 1;
        return {
          ...p,
          currentDie: nextDie,
          hadAccident: nextDie === 1,
        };
      });
      setPlayers(next);

      const victims = next.filter((p) => !p.eliminated && p.currentDie === 1);
      if (victims.length === 0) {
        setCommentary(
          `Ronda ${round} (Moderador): Ningún jugador tiene 1. Haz clic en algún dado si quieres forzar un accidente, o pulsa "Resolver accidentes".`
        );
      } else {
        const names = formatNameList(victims.map((v) => v.name));
        setCommentary(
          `Ronda ${round} (Moderador): Accidente marcado para ${names} (${victims.length * 6} fichas en riesgo). Pulsa "Resolver accidentes" para aplicar la regla.`
        );
      }
    },
    [mode, step, isDiceRolling, players, round]
  );

  const handleRevealCards = useCallback(() => {
    tabletopAudio.playCardFlip();
    setActiveTurnPlayerId(null);
    setStep('REVEAL');
    const info = describeContributors(players);
    const activeCount = players.filter((p) => !p.eliminated).length;
    setCommentary(
      `¡Tarjetas volteadas! ${info.label} (${info.count} de ${activeCount} jugadores activos). Ahora cada quien que aportó mete 2 fichas al fondo común.`
    );
  }, [players]);

  const handleCollectPayments = useCallback(() => {
    const contributors = players.filter((p) => !p.eliminated && p.currentDecision === 'APORTO');
    const inflow = contributors.length * CONTRIBUTION_COST;
    const nextFund = reserveBeforeRound + inflow;

    const updatedPlayers = players.map((p) => {
      if (p.eliminated) {
        return {
          ...p,
          contributionHistory: [...p.contributionHistory, null],
          lastDelta: null,
        };
      }
      const contributed = p.currentDecision === 'APORTO';
      return {
        ...p,
        chips: contributed ? p.chips - CONTRIBUTION_COST : p.chips,
        contributionHistory: [...p.contributionHistory, contributed],
        lastDelta: contributed ? -CONTRIBUTION_COST : 0,
      };
    });

    const transfers: ChipTransfer[] = contributors.map((p) => ({
      id: `contrib-${round}-${p.id}`,
      fromSeat: p.seatIndex,
      toSeat: 'VAULT',
      amount: CONTRIBUTION_COST,
      variant: 'CONTRIBUTION',
    }));

    contributors.forEach((_, idx) => {
      tabletopAudio.playChipClink(idx * 0.065);
    });

    setPlayers(updatedPlayers);
    setRoundInflow(inflow);
    setFund(nextFund);
    setActiveTransfers(transfers);
    setStep('PAYMENT');

    if (transferTimeoutRef.current !== null) {
      window.clearTimeout(transferTimeoutRef.current);
    }
    transferTimeoutRef.current = window.setTimeout(() => {
      setActiveTransfers([]);
    }, 950);

    if (mode === 'GUIDED_DEMO') {
      setCommentary(GUIDED_DEMO_SCRIPT[round - 1].paymentNote);
    } else if (inflow === 0) {
      setCommentary(
        `Nadie aportó en esta ronda. El fondo permanece en ${nextFund} fichas. Toca lanzar los dados.`
      );
    } else {
      setCommentary(
        `Entran +${inflow} fichas al bote común (${contributors.length} × 2). El fondo sube a ${nextFund} fichas. Ahora cada jugador activo lanza su dado.`
      );
    }
  }, [players, reserveBeforeRound, round, mode]);

  const handleRollDice = useCallback(() => {
    clearAllTimers();
    setActiveTransfers([]);
    setIsDiceRolling(true);
    tabletopAudio.playDiceRoll();

    rollIntervalRef.current = window.setInterval(() => {
      setPlayers((prev) =>
        prev.map((p) => (p.eliminated ? p : { ...p, currentDie: rollFairDie() }))
      );
    }, 85);

    rollTimeoutRef.current = window.setTimeout(() => {
      if (rollIntervalRef.current !== null) {
        window.clearInterval(rollIntervalRef.current);
        rollIntervalRef.current = null;
      }

      const script = mode === 'GUIDED_DEMO' ? GUIDED_DEMO_SCRIPT[round - 1] : null;
      const landedPlayers: PlayerState[] = players.map((p) => {
        if (p.eliminated) return p;
        const dieVal = script ? script.dice[p.id] ?? rollFairDie() : rollFairDie();
        return {
          ...p,
          currentDie: dieVal,
          hadAccident: dieVal === 1,
          lastDelta: null,
        };
      });

      setPlayers(landedPlayers);
      setIsDiceRolling(false);
      setStep('DICE');

      const victims = landedPlayers.filter((p) => !p.eliminated && p.currentDie === 1);
      if (victims.length > 0) {
        tabletopAudio.playAccident();
      }

      if (mode === 'GUIDED_DEMO' && script) {
        setCommentary(script.diceNote);
      } else if (victims.length === 0) {
        const extra =
          mode === 'MODERATOR'
            ? ' (Puedes hacer clic en cualquier dado para forzar un 1 y mostrar un accidente).'
            : '';
        setCommentary(
          `¡Todos a salvo! Nadie sacó 1 en la Ronda ${round}. El fondo entero se conserva como reserva.${extra}`
        );
      } else {
        const names = formatNameList(victims.map((v) => v.name));
        const extra =
          mode === 'MODERATOR'
            ? ' Puedes tocar los dados para ajustar accidentes antes de resolver.'
            : '';
        setCommentary(
          `¡Accidente en la Ronda ${round}! ${names} ${
            victims.length === 1 ? 'sacó' : 'sacaron'
          } 1 (costo: 6 fichas c/u).${extra}`
        );
      }
    }, 520);
  }, [clearAllTimers, mode, round, players]);

  const handleResolveAccidents = useCallback(() => {
    const scriptedNote =
      mode === 'GUIDED_DEMO' ? GUIDED_DEMO_SCRIPT[round - 1].resolutionNote : undefined;

    const result = resolveRoundAccidents(
      players,
      fund,
      reserveBeforeRound,
      roundInflow,
      round,
      scriptedNote
    );

    setPlayers(result.updatedPlayers);
    setFund(result.newFund);
    setLedger((prev) => [...prev, result.ledgerEntry]);
    setCommentary(result.commentary);
    setActiveTransfers(result.transfers);
    setStep('RESOLUTION');

    if (transferTimeoutRef.current !== null) {
      window.clearTimeout(transferTimeoutRef.current);
    }
    transferTimeoutRef.current = window.setTimeout(() => {
      setActiveTransfers([]);
    }, 1000);

    if (result.anyBankrupt) {
      tabletopAudio.playElimination();
    } else if (result.anyProtected) {
      tabletopAudio.playProtectedSave();
    } else if (result.anySelfPaid) {
      tabletopAudio.playAccident();
    } else {
      tabletopAudio.playChipClink(0);
    }
  }, [mode, round, players, fund, reserveBeforeRound, roundInflow]);

  const handleNextRoundOrFinale = useCallback(() => {
    if (round >= TOTAL_ROUNDS) {
      tabletopAudio.playVictory();
      setScreen('FINALE');
      return;
    }

    const activeCount = players.filter((p) => !p.eliminated).length;
    const contributedLast = players.filter(
      (p) => !p.eliminated && p.currentDecision === 'APORTO'
    ).length;
    const participationRate = activeCount > 0 ? contributedLast / activeCount : 0;

    tabletopAudio.playCardSelect();
    prepareRound(round + 1, players, fund, mode, participationRate);
  }, [round, players, fund, mode, prepareRound]);

  const pendingDecisionsCount = useMemo(
    () =>
      players.filter(
        (p) => !p.eliminated && !p.cannotAffordContribution && p.currentDecision === null
      ).length,
    [players]
  );

  const activeTurnPlayer = useMemo(() => {
    if (step !== 'DECISION' || !activeTurnPlayerId) return null;
    return players.find((p) => p.id === activeTurnPlayerId) ?? null;
  }, [step, activeTurnPlayerId, players]);

  const handleAdvanceStep = useCallback(() => {
    if (isDiceRolling) return;
    if (step === 'DECISION' && pendingDecisionsCount > 0) return;

    switch (step) {
      case 'DECISION':
        handleRevealCards();
        break;
      case 'REVEAL':
        handleCollectPayments();
        break;
      case 'PAYMENT':
        handleRollDice();
        break;
      case 'DICE':
        handleResolveAccidents();
        break;
      case 'RESOLUTION':
      case 'ROUND_END':
        handleNextRoundOrFinale();
        break;
    }
  }, [
    isDiceRolling,
    step,
    pendingDecisionsCount,
    handleRevealCards,
    handleCollectPayments,
    handleRollDice,
    handleResolveAccidents,
    handleNextRoundOrFinale,
  ]);

  const finalSummary = useMemo(() => computeFinalSummary(players, fund), [players, fund]);

  // Spacebar shortcut for smooth live classroom presentations
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (screen !== 'TABLE' || rulesOpen || ledgerOpen || setupMode !== null || isDiceRolling) {
        return;
      }
      if (e.code !== 'Space') return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'INPUT')) return;
      if (step === 'DECISION' && (activeTurnPlayer !== null || pendingDecisionsCount > 0)) return;

      e.preventDefault();
      handleAdvanceStep();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    screen,
    rulesOpen,
    ledgerOpen,
    setupMode,
    isDiceRolling,
    step,
    activeTurnPlayer,
    pendingDecisionsCount,
    handleAdvanceStep,
  ]);

  const topRowPlayers = players.slice(0, 3);
  const bottomRowPlayers = players.slice(3, 6);
  const hasActiveTurn = activeTurnPlayer !== null;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#091C16] text-[#F5F2EB]">
      {/* Luxury Emerald Wool Felt Background Layer */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {!bgError ? (
          <img
            src={FELT_BG_IMAGE}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setBgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,#144634_0%,#0A251B_62%,#061510_100%)]" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,24,18,0.42)_0%,rgba(5,18,14,0.78)_100%)]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <TopBar
          screen={screen}
          soundEnabled={soundEnabled}
          ledgerCount={ledger.length}
          onGoHome={() => {
            clearAllTimers();
            setScreen('TITLE');
          }}
          onOpenRules={() => setRulesOpen(true)}
          onOpenLedger={() => setLedgerOpen(true)}
          onToggleSound={handleToggleSound}
          onPrimaryAction={() =>
            screen === 'TITLE' ? launchGame('GUIDED_DEMO') : launchGame(mode)
          }
        />

        {screen === 'TITLE' && (
          <TitleScreen
            onSelectMode={handleSelectModeFromTitle}
            onOpenRules={() => setRulesOpen(true)}
          />
        )}

        {screen === 'TABLE' && (
          <main className="mx-auto flex w-full max-w-[1380px] flex-1 flex-col justify-between gap-4 px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
            {/* Top 3 Player Stations */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {topRowPlayers.map((player) => (
                <PlayerSeat
                  key={player.id}
                  player={player}
                  step={step}
                  mode={mode}
                  round={round}
                  isDiceRolling={isDiceRolling}
                  moderatorPeek={moderatorPeek}
                  isCurrentTurn={activeTurnPlayer?.id === player.id}
                  hasActiveTurn={hasActiveTurn}
                  onSelectSeatForTurn={handleSelectSeatForTurn}
                  onModeratorToggleDie={handleModeratorToggleDie}
                />
              ))}
            </div>

            {/* Center Focal Anchor: Central Fund Vault */}
            <CentralVault
              fund={fund}
              reserveBeforeRound={reserveBeforeRound}
              roundInflow={roundInflow}
              round={round}
              totalRounds={TOTAL_ROUNDS}
              step={step}
              activeTransfers={activeTransfers}
            />

            {/* Bottom 3 Player Stations */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {bottomRowPlayers.map((player) => (
                <PlayerSeat
                  key={player.id}
                  player={player}
                  step={step}
                  mode={mode}
                  round={round}
                  isDiceRolling={isDiceRolling}
                  moderatorPeek={moderatorPeek}
                  isCurrentTurn={activeTurnPlayer?.id === player.id}
                  hasActiveTurn={hasActiveTurn}
                  onSelectSeatForTurn={handleSelectSeatForTurn}
                  onModeratorToggleDie={handleModeratorToggleDie}
                />
              ))}
            </div>

            {/* Bottom Moderator Command & Commentary Bar */}
            <ModeratorBar
              mode={mode}
              moderatorName={moderatorName}
              round={round}
              step={step}
              commentary={commentary}
              isDiceRolling={isDiceRolling}
              activeTurnPlayer={activeTurnPlayer}
              pendingDecisionsCount={pendingDecisionsCount}
              moderatorPeek={moderatorPeek}
              onToggleModeratorPeek={() => setModeratorPeek((v) => !v)}
              onPlayerDecision={handlePlayerDecision}
              onAdvanceStep={handleAdvanceStep}
            />
          </main>
        )}

        {screen === 'FINALE' && (
          <FinaleOverlay
            summary={finalSummary}
            mode={mode}
            onPlayAgain={() => launchGame(mode)}
            onOpenLedger={() => setLedgerOpen(true)}
            onGoHome={() => {
              clearAllTimers();
              setScreen('TITLE');
            }}
          />
        )}
      </div>

      {/* Overlays: Setup Players, Live Round Ledger & Rules Reference */}
      <SetupPlayersModal
        mode={setupMode}
        initialNames={customNames}
        initialColors={customColors}
        initialModeratorName={moderatorName}
        onCancel={() => setSetupMode(null)}
        onConfirm={(selectedMode, names, colors, modName) =>
          launchGame(selectedMode, names, colors, modName)
        }
      />
      <LedgerDrawer open={ledgerOpen} entries={ledger} onClose={() => setLedgerOpen(false)} />
      <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
