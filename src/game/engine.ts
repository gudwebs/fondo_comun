import {
  BotPersonality,
  ChipTransfer,
  Decision,
  FinalPlayerResult,
  FinalSummary,
  GameMode,
  LedgerEntry,
  PlayerColorId,
  PlayerRoundOutcome,
  PlayerState,
} from './types';
import { DEFAULT_SEAT_COLORS } from './colors';

export const INITIAL_CHIPS = 12;
export const TOTAL_ROUNDS = 5;
export const CONTRIBUTION_COST = 2;
export const ACCIDENT_COST = 6;
export const ACCIDENT_DIE_VALUE = 1;

export const TEAM_MEMBERS = [
  'Blanca Matanzo Hermoso',
  'Mayela Eguibar Ortega',
  'Gudvan Alfredo Flores Carreón',
  'José Miguel Berman Gutiérrez',
];

interface PlayerTemplate {
  id: string;
  name: string;
  initials: string;
  personality: BotPersonality;
  personalityLabel: string;
}

export const PLAYER_TEMPLATES: PlayerTemplate[] = [
  { id: 'ana', name: 'Ana', initials: 'AN', personality: 'COOPERATIVA', personalityLabel: 'Cooperativa' },
  { id: 'beto', name: 'Beto', initials: 'BE', personality: 'SOLIDARIO', personalityLabel: 'Solidario' },
  { id: 'caro', name: 'Caro', initials: 'CA', personality: 'ANALITICA', personalityLabel: 'Analítica' },
  { id: 'dani', name: 'Dani', initials: 'DA', personality: 'CALCULADOR', personalityLabel: 'Calculador' },
  { id: 'eli', name: 'Eli', initials: 'EL', personality: 'COOPERATIVA', personalityLabel: 'Cooperativa' },
  { id: 'fer', name: 'Fer', initials: 'FE', personality: 'ARRIESGADO', personalityLabel: 'Arriesgado' },
];

export interface GuidedRoundScript {
  round: number;
  decisions: Record<string, Decision>;
  dice: Record<string, number>;
  decisionNote: string;
  paymentNote: string;
  diceNote: string;
  resolutionNote: string;
}

/**
 * Exact 5-round example from the official GMMB game document.
 */
export const GUIDED_DEMO_SCRIPT: GuidedRoundScript[] = [
  {
    round: 1,
    decisions: {
      ana: 'APORTO',
      beto: 'APORTO',
      caro: 'APORTO',
      dani: 'APORTO',
      eli: 'APORTO',
      fer: 'APORTO',
    },
    dice: { ana: 4, beto: 1, caro: 5, dani: 3, eli: 6, fer: 2 },
    decisionNote:
      'Ronda 1 (Ejemplo oficial): Todos los jugadores colocan boca abajo su tarjeta en secreto. En esta primera ronda todos confían en el grupo y deciden aportar.',
    paymentNote:
      'Los 6 amigos aportan 2 fichas cada uno (6 × 2 = 12 fichas). El fondo arranca sólido con 12 fichas y cada jugador queda con 10.',
    diceNote:
      'Se lanzan los 6 dados: Beto saca un 1 y sufre un accidente que cuesta 6 fichas.',
    resolutionNote:
      'Como Beto aportó en esta ronda, el fondo paga sus 6 fichas completas. Beto conserva sus 10 fichas y quedan 6 fichas de reserva en el fondo.',
  },
  {
    round: 2,
    decisions: {
      ana: 'APORTO',
      beto: 'APORTO',
      caro: 'APORTO',
      dani: 'APORTO',
      eli: 'APORTO',
      fer: 'NO_APORTO',
    },
    dice: { ana: 3, beto: 5, caro: 1, dani: 4, eli: 2, fer: 1 },
    decisionNote:
      'Ronda 2: Fer decide arriesgarse por su cuenta para ahorrarse 2 fichas (NO APORTO). Los otros 5 deciden seguir aportando.',
    paymentNote:
      '5 jugadores aportan 2 fichas cada uno (+10). Sumadas a la reserva de 6, el fondo sube a 16 fichas.',
    diceNote:
      'Doble accidente: Caro y Fer sacan 1 en sus dados. Cada accidente cuesta 6 fichas.',
    resolutionNote:
      'El fondo paga 6 fichas a Caro porque sí aportó. Fer no aportó y debe pagar las 6 fichas de su propio bolsillo (baja de 10 a 4). El fondo cierra en 10.',
  },
  {
    round: 3,
    decisions: {
      ana: 'APORTO',
      beto: 'APORTO',
      caro: 'APORTO',
      dani: 'NO_APORTO',
      eli: 'APORTO',
      fer: 'APORTO',
    },
    dice: { ana: 1, beto: 6, caro: 3, dani: 5, eli: 1, fer: 4 },
    decisionNote:
      'Ronda 3: Fer vuelve a aportar tras el golpe anterior, mientras Dani se arriesga y elige NO APORTO (pierde su racha de socio fiel).',
    paymentNote:
      '5 jugadores aportan (+10 fichas). Con las 10 de reserva, el fondo alcanza 20 fichas.',
    diceNote:
      'Ana y Eli sacan 1. Hay dos accidentes simultáneos que requieren 12 fichas en total.',
    resolutionNote:
      'El fondo paga 12 fichas (6 a Ana y 6 a Eli). Lo aportado en esta ronda (10) no alcanzaba; la reserva acumulada cubrió la diferencia. Quedan 8 fichas en el fondo.',
  },
  {
    round: 4,
    decisions: {
      ana: 'APORTO',
      beto: 'APORTO',
      caro: 'APORTO',
      dani: 'APORTO',
      eli: 'APORTO',
      fer: 'APORTO',
    },
    dice: { ana: 5, beto: 2, caro: 6, dani: 1, eli: 3, fer: 4 },
    decisionNote:
      'Ronda 4: Viendo que el fondo responde bien, los 6 amigos aportan — incluido Fer, que usa sus últimas 2 fichas.',
    paymentNote:
      'Todos aportan (6 × 2 = 12). El fondo sube de 8 a 20 fichas. Fer queda con 0 fichas en mano.',
    diceNote:
      'Dani saca 1 y sufre un accidente de 6 fichas.',
    resolutionNote:
      'Esta vez Dani sí aportó, por lo que el fondo cubre sus 6 fichas completas. El fondo cierra la ronda con 14 fichas de reserva.',
  },
  {
    round: 5,
    decisions: {
      ana: 'APORTO',
      beto: 'APORTO',
      caro: 'APORTO',
      dani: 'APORTO',
      eli: 'APORTO',
      fer: 'NO_APORTO',
    },
    dice: { ana: 4, beto: 6, caro: 2, dani: 5, eli: 3, fer: 1 },
    decisionNote:
      'Ronda 5 (Última ronda): Fer tiene 0 fichas y no puede aportar. Los otros 5 aportan buscando protegerse y cerrar el juego.',
    paymentNote:
      '5 jugadores aportan (+10). El fondo acumulado alcanza 24 fichas listas para cubrir accidentes o repartirse al cierre.',
    diceNote:
      'Fer saca 1 en el dado y sufre un accidente de 6 fichas sin protección del fondo.',
    resolutionNote:
      'Fer no aportó y tiene 0 fichas: no puede pagar los 6 y queda ELIMINADO. El fondo termina intacto con 24 fichas listas para repartirse entre los socios fieles.',
  },
];

function makeInitials(name: string): string {
  const clean = name.trim();
  if (!clean) return 'JG';
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export function createInitialPlayers(
  mode: GameMode,
  customNames?: string[],
  customColors?: PlayerColorId[]
): PlayerState[] {
  return PLAYER_TEMPLATES.map((tpl, idx) => {
    const isHuman = mode === 'PLAY_VS_BOTS' && idx === 0;
    const rawCustom = customNames?.[idx]?.trim();
    const resolvedName =
      mode === 'GUIDED_DEMO'
        ? tpl.name
        : rawCustom && rawCustom.length > 0
        ? rawCustom
        : isHuman
        ? 'Tú'
        : tpl.name;
    const resolvedColor: PlayerColorId =
      mode === 'GUIDED_DEMO'
        ? DEFAULT_SEAT_COLORS[idx]
        : customColors?.[idx] ?? DEFAULT_SEAT_COLORS[idx];

    return {
      id: tpl.id,
      name: resolvedName,
      initials: makeInitials(resolvedName),
      colorId: resolvedColor,
      seatIndex: idx,
      isHuman,
      personality: isHuman ? 'HUMAN' : tpl.personality,
      personalityLabel:
        mode === 'MODERATOR'
          ? `Jugador ${idx + 1}`
          : isHuman
          ? 'Tú'
          : tpl.personalityLabel,
      chips: INITIAL_CHIPS,
      eliminated: false,
      eliminatedRound: null,
      contributionHistory: [],
      currentDecision: null,
      cannotAffordContribution: false,
      currentDie: null,
      hadAccident: false,
      roundOutcome: null,
      lastDelta: null,
    };
  });
}

export function chooseBotDecision(
  player: PlayerState,
  round: number,
  currentFund: number,
  lastParticipationRate: number
): Decision {
  if (player.eliminated || player.chips < CONTRIBUTION_COST) {
    return 'NO_APORTO';
  }

  const isStillFaithful =
    player.contributionHistory.length === round - 1 &&
    player.contributionHistory.every((v) => v === true);

  let coopProb = 0.78;

  switch (player.personality) {
    case 'SOLIDARIO':
      coopProb = 0.94;
      break;
    case 'COOPERATIVA':
      coopProb = isStillFaithful ? 0.9 : 0.75;
      break;
    case 'ANALITICA':
      // Cooperates strongly when group is cooperating or fund is healthy
      coopProb = lastParticipationRate >= 0.65 ? 0.88 : 0.45;
      if (currentFund >= 8 && isStillFaithful) coopProb = Math.min(0.95, coopProb + 0.12);
      break;
    case 'CALCULADOR':
      // Weighs faithful-partner payout vs saving 2 chips
      coopProb = round === TOTAL_ROUNDS && isStillFaithful && currentFund >= 10 ? 0.96 : 0.66;
      if (lastParticipationRate < 0.5) coopProb = 0.3;
      break;
    case 'ARRIESGADO':
      coopProb = player.chips <= 6 ? 0.72 : 0.48;
      if (round === 1) coopProb = 0.65;
      break;
    default:
      coopProb = 0.75;
  }

  return Math.random() < coopProb ? 'APORTO' : 'NO_APORTO';
}

export function rollFairDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function formatNameList(names: string[]): string {
  if (names.length === 0) return 'Ninguno';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} y ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`;
}

export function describeContributors(players: PlayerState[]): {
  label: string;
  count: number;
} {
  const active = players.filter((p) => !p.eliminated);
  const contributors = active.filter((p) => p.currentDecision === 'APORTO');
  const nonContributors = active.filter((p) => p.currentDecision !== 'APORTO');

  if (contributors.length === 0) {
    return { label: 'Nadie aportó', count: 0 };
  }
  if (nonContributors.length === 0) {
    return {
      label: `Todos (${contributors.length} × 2 = ${contributors.length * CONTRIBUTION_COST})`,
      count: contributors.length,
    };
  }
  if (nonContributors.length === 1) {
    const skipped = nonContributors[0];
    const suffix = skipped.cannotAffordContribution ? ' (sin fichas)' : '';
    return {
      label: `Todos menos ${skipped.name.replace(' (Tú)', '')}${suffix}`,
      count: contributors.length,
    };
  }
  return {
    label: `${formatNameList(contributors.map((p) => p.name.replace(' (Tú)', '')))} (${contributors.length} × 2)`,
    count: contributors.length,
  };
}

export interface ResolutionResult {
  updatedPlayers: PlayerState[];
  newFund: number;
  transfers: ChipTransfer[];
  ledgerEntry: LedgerEntry;
  commentary: string;
  anyBankrupt: boolean;
  anyProtected: boolean;
  anySelfPaid: boolean;
}

export function resolveRoundAccidents(
  players: PlayerState[],
  fundAfterContributions: number,
  fundBeforeRound: number,
  roundInflow: number,
  round: number,
  scriptedCommentary?: string
): ResolutionResult {
  const activePlayers = players.filter((p) => !p.eliminated);
  const accidentPlayers = activePlayers.filter((p) => p.currentDie === ACCIDENT_DIE_VALUE);
  const insuredVictims = accidentPlayers.filter((p) => p.currentDecision === 'APORTO');
  const uninsuredVictims = accidentPlayers.filter((p) => p.currentDecision !== 'APORTO');

  let remainingFund = fundAfterContributions;
  const transfers: ChipTransfer[] = [];
  const events: string[] = [];

  let anyBankrupt = false;
  let anyProtected = false;
  let anySelfPaid = false;

  // Map outcomes by player id
  const outcomeById = new Map<string, { outcome: PlayerRoundOutcome; newChips: number; eliminated: boolean; delta: number | null }>();

  // 1. Handle insured victims (those who contributed this round)
  if (insuredVictims.length > 0) {
    const totalNeeded = insuredVictims.length * ACCIDENT_COST;
    if (remainingFund >= totalNeeded) {
      remainingFund -= totalNeeded;
      anyProtected = true;
      insuredVictims.forEach((v) => {
        outcomeById.set(v.id, {
          outcome: {
            type: 'COVERED_BY_FUND',
            fundPaid: ACCIDENT_COST,
            selfPaid: 0,
            summary: `El fondo cubre las ${ACCIDENT_COST} fichas`,
          },
          newChips: v.chips,
          eliminated: false,
          delta: 0,
        });
        transfers.push({
          id: `payout-${round}-${v.id}`,
          fromSeat: 'VAULT',
          toSeat: v.seatIndex,
          amount: ACCIDENT_COST,
          variant: 'PAYOUT',
        });
      });

      const names = formatNameList(insuredVictims.map((v) => v.name.replace(' (Tú)', '')));
      const usedReserve = totalNeeded > roundInflow;
      if (usedReserve) {
        events.push(
          `El fondo paga ${totalNeeded} a ${names}. Lo aportado en esta ronda (${roundInflow}) no alcanzaba; la reserva cubrió la diferencia.`
        );
      } else {
        events.push(`El fondo paga ${totalNeeded} a ${names}.`);
      }
    } else {
      // Insufficient fund! Split equally among insured victims; remainder stays in fund.
      const sharePerVictim = Math.floor(remainingFund / insuredVictims.length);
      const leftover = remainingFund % insuredVictims.length;
      remainingFund = leftover;
      const shortfall = ACCIDENT_COST - sharePerVictim;

      const shortNotes: string[] = [];
      insuredVictims.forEach((v) => {
        if (sharePerVictim > 0) {
          transfers.push({
            id: `partial-${round}-${v.id}`,
            fromSeat: 'VAULT',
            toSeat: v.seatIndex,
            amount: sharePerVictim,
            variant: 'PAYOUT',
          });
        }
        if (v.chips >= shortfall) {
          anySelfPaid = true;
          outcomeById.set(v.id, {
            outcome: {
              type: 'PARTIAL_FUND_COVERED',
              fundPaid: sharePerVictim,
              selfPaid: shortfall,
              summary: `Fondo aporta ${sharePerVictim}; paga ${shortfall} propias`,
            },
            newChips: v.chips - shortfall,
            eliminated: false,
            delta: -shortfall,
          });
          shortNotes.push(`${v.name.replace(' (Tú)', '')} paga ${shortfall}`);
        } else {
          anyBankrupt = true;
          outcomeById.set(v.id, {
            outcome: {
              type: 'PARTIAL_FUND_BANKRUPT',
              fundPaid: sharePerVictim,
              selfPaid: v.chips,
              summary: `Fondo aporta ${sharePerVictim}; no puede cubrir ${shortfall} — Eliminado`,
            },
            newChips: 0,
            eliminated: true,
            delta: -shortfall,
          });
          shortNotes.push(`${v.name.replace(' (Tú)', '')} quiebra y queda eliminado`);
        }
      });

      events.push(
        `Fondo insuficiente: se reparten ${sharePerVictim} fichas a cada accidentado asegurado y el resto sale de sus fichas (${shortNotes.join('; ')}).`
      );
    }
  }

  // 2. Handle uninsured victims (did NOT contribute this round)
  uninsuredVictims.forEach((v) => {
    const cleanName = v.name.replace(' (Tú)', '');
    if (v.chips >= ACCIDENT_COST) {
      anySelfPaid = true;
      outcomeById.set(v.id, {
        outcome: {
          type: 'SELF_PAID',
          fundPaid: 0,
          selfPaid: ACCIDENT_COST,
          summary: `No aportó: paga ${ACCIDENT_COST} fichas propias`,
        },
        newChips: v.chips - ACCIDENT_COST,
        eliminated: false,
        delta: -ACCIDENT_COST,
      });
      events.push(`${cleanName} no aportó y paga ${ACCIDENT_COST} por su cuenta.`);
    } else {
      anyBankrupt = true;
      outcomeById.set(v.id, {
        outcome: {
          type: 'SELF_BANKRUPT',
          fundPaid: 0,
          selfPaid: v.chips,
          summary: `No puede pagar ${ACCIDENT_COST} fichas — Eliminado`,
        },
        newChips: 0,
        eliminated: true,
        delta: -ACCIDENT_COST,
      });
      events.push(`${cleanName} no puede pagar los ${ACCIDENT_COST} y queda eliminado.`);
    }
  });

  if (accidentPlayers.length === 0) {
    events.push('Nadie sacó 1 en esta ronda. Todo el fondo se guarda íntegro como reserva.');
  }

  const updatedPlayers: PlayerState[] = players.map((p) => {
    if (p.eliminated) return p;
    const res = outcomeById.get(p.id);
    if (!res) {
      return {
        ...p,
        hadAccident: false,
        roundOutcome: {
          type: 'NONE',
          fundPaid: 0,
          selfPaid: 0,
          summary: 'Sin accidente',
        },
        lastDelta: null,
      };
    }
    return {
      ...p,
      chips: res.newChips,
      eliminated: res.eliminated,
      eliminatedRound: res.eliminated ? round : p.eliminatedRound,
      hadAccident: true,
      roundOutcome: res.outcome,
      lastDelta: res.delta,
    };
  });

  const contribInfo = describeContributors(players);
  const accidentsNames = accidentPlayers.map((p) => p.name.replace(' (Tú)', ''));
  const usedReserve = insuredVictims.length * ACCIDENT_COST > roundInflow && insuredVictims.length > 0;
  const commentary = scriptedCommentary ?? events.join(' ');

  const ledgerEntry: LedgerEntry = {
    round,
    contributorsLabel: contribInfo.label,
    contributorsCount: contribInfo.count,
    roundInflow,
    fundBefore: fundBeforeRound,
    fundAfterContributions,
    accidentsLabel: formatNameList(accidentsNames),
    accidentsNames,
    whatHappened: events.join(' '),
    fundFinal: remainingFund,
    usedReserve,
  };

  return {
    updatedPlayers,
    newFund: remainingFund,
    transfers,
    ledgerEntry,
    commentary,
    anyBankrupt,
    anyProtected,
    anySelfPaid,
  };
}

export function computeFinalSummary(players: PlayerState[], finalFund: number): FinalSummary {
  const faithfulPlayers = players.filter(
    (p) =>
      !p.eliminated &&
      p.contributionHistory.length === TOTAL_ROUNDS &&
      p.contributionHistory.every((c) => c === true)
  );

  const faithfulCount = faithfulPlayers.length;
  const sharePerFaithful = faithfulCount > 0 ? Math.floor(finalFund / faithfulCount) : 0;
  const leftoverFund = faithfulCount > 0 ? finalFund % faithfulCount : finalFund;

  const rawResults: FinalPlayerResult[] = players.map((p) => {
    const isFaithful =
      !p.eliminated &&
      p.contributionHistory.length === TOTAL_ROUNDS &&
      p.contributionHistory.every((c) => c === true);
    const fundShare = isFaithful ? sharePerFaithful : 0;
    const finalPoints = p.eliminated ? 0 : p.chips + fundShare;
    return {
      player: p,
      isFaithful,
      fundShare,
      finalPoints,
      isWinner: false,
    };
  });

  const activeResults = rawResults.filter((r) => !r.player.eliminated);
  const maxPoints = activeResults.length > 0 ? Math.max(...activeResults.map((r) => r.finalPoints)) : -1;

  const results = rawResults
    .map((r) => ({
      ...r,
      isWinner: !r.player.eliminated && r.finalPoints === maxPoints && maxPoints >= 0,
    }))
    .sort((a, b) => {
      if (a.player.eliminated !== b.player.eliminated) {
        return a.player.eliminated ? 1 : -1;
      }
      if (b.finalPoints !== a.finalPoints) {
        return b.finalPoints - a.finalPoints;
      }
      return a.player.seatIndex - b.player.seatIndex;
    });

  const winners = results.filter((r) => r.isWinner).map((r) => r.player);

  return {
    results,
    faithfulCount,
    fundBeforeDistribution: finalFund,
    sharePerFaithful,
    leftoverFund,
    winners,
    isTie: winners.length > 1,
  };
}
