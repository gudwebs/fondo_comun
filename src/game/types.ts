export type GameMode = 'GUIDED_DEMO' | 'PLAY_VS_BOTS' | 'MODERATOR';

export type ScreenState = 'TITLE' | 'TABLE' | 'FINALE';

export type RoundStep =
  | 'DECISION'
  | 'REVEAL'
  | 'PAYMENT'
  | 'DICE'
  | 'RESOLUTION'
  | 'ROUND_END';

export type Decision = 'APORTO' | 'NO_APORTO';

export type BotPersonality = 'HUMAN' | 'SOLIDARIO' | 'ANALITICA' | 'CALCULADOR' | 'COOPERATIVA' | 'ARRIESGADO';

export type AccidentOutcomeType =
  | 'NONE'
  | 'COVERED_BY_FUND'
  | 'PARTIAL_FUND_COVERED'
  | 'PARTIAL_FUND_BANKRUPT'
  | 'SELF_PAID'
  | 'SELF_BANKRUPT';

export interface PlayerRoundOutcome {
  type: AccidentOutcomeType;
  fundPaid: number;
  selfPaid: number;
  summary: string;
}

export type PlayerColorId =
  | 'gold'
  | 'ruby'
  | 'sapphire'
  | 'emerald'
  | 'amethyst'
  | 'copper'
  | 'teal'
  | 'rose';

export interface PlayerState {
  id: string;
  name: string;
  initials: string;
  colorId: PlayerColorId;
  seatIndex: number; // 0..5 clockwise around table
  isHuman: boolean;
  personality: BotPersonality;
  personalityLabel: string;
  chips: number;
  eliminated: boolean;
  eliminatedRound: number | null;
  /** Length = rounds completed or active decision recorded */
  contributionHistory: Array<boolean | null>; // true = aportó, false = no aportó, null = eliminado
  currentDecision: Decision | null;
  cannotAffordContribution: boolean;
  currentDie: number | null;
  hadAccident: boolean;
  roundOutcome: PlayerRoundOutcome | null;
  lastDelta: number | null;
}

export interface ChipTransfer {
  id: string;
  fromSeat: number | 'VAULT';
  toSeat: number | 'VAULT';
  amount: number;
  variant: 'CONTRIBUTION' | 'PAYOUT' | 'PENALTY';
}

export interface LedgerEntry {
  round: number;
  contributorsLabel: string;
  contributorsCount: number;
  roundInflow: number;
  fundBefore: number;
  fundAfterContributions: number;
  accidentsLabel: string;
  accidentsNames: string[];
  whatHappened: string;
  fundFinal: number;
  usedReserve: boolean;
}

export interface FinalPlayerResult {
  player: PlayerState;
  isFaithful: boolean;
  fundShare: number;
  finalPoints: number;
  isWinner: boolean;
}

export interface FinalSummary {
  results: FinalPlayerResult[];
  faithfulCount: number;
  fundBeforeDistribution: number;
  sharePerFaithful: number;
  leftoverFund: number;
  winners: PlayerState[];
  isTie: boolean;
}
