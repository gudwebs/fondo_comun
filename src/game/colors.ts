import { PlayerColorId } from './types';

export interface PlayerColorSpec {
  id: PlayerColorId;
  label: string;
  swatchBg: string;
  monogramClasses: string;
  seatIdleBorder: string;
  seatActiveClasses: string;
  haloClasses: string;
  turnText: string;
  cardBackBorder: string;
  cardSealBg: string;
  cardFrontRibbon: string;
}

export const PLAYER_COLORS: Record<PlayerColorId, PlayerColorSpec> = {
  gold: {
    id: 'gold',
    label: 'Dorado',
    swatchBg: 'bg-[#D9A441]',
    monogramClasses: 'border-[#D9A441]/75 bg-[#D9A441]/18 text-[#F6DC99]',
    seatIdleBorder: 'border-[#D9A441]/30',
    seatActiveClasses:
      'border-[#F6DC99] bg-[#143024]/95 shadow-[0_0_32px_rgba(217,164,65,0.42)]',
    haloClasses:
      'border-2 border-[#F6DC99]/85 shadow-[0_0_26px_rgba(217,164,65,0.55),inset_0_0_14px_rgba(217,164,65,0.22)]',
    turnText: 'text-[#F6DC99]',
    cardBackBorder: 'border-[#D9A441]',
    cardSealBg: 'bg-[#D9A441]',
    cardFrontRibbon: 'bg-[#D9A441]',
  },
  sapphire: {
    id: 'sapphire',
    label: 'Zafiro',
    swatchBg: 'bg-[#4E9AF1]',
    monogramClasses: 'border-[#4E9AF1]/75 bg-[#4E9AF1]/18 text-[#93C5FD]',
    seatIdleBorder: 'border-[#4E9AF1]/32',
    seatActiveClasses:
      'border-[#93C5FD] bg-[#0F2A33]/95 shadow-[0_0_32px_rgba(78,154,241,0.42)]',
    haloClasses:
      'border-2 border-[#93C5FD]/85 shadow-[0_0_26px_rgba(78,154,241,0.55),inset_0_0_14px_rgba(78,154,241,0.22)]',
    turnText: 'text-[#93C5FD]',
    cardBackBorder: 'border-[#4E9AF1]',
    cardSealBg: 'bg-[#4E9AF1]',
    cardFrontRibbon: 'bg-[#4E9AF1]',
  },
  ruby: {
    id: 'ruby',
    label: 'Rubí',
    swatchBg: 'bg-[#E05263]',
    monogramClasses: 'border-[#E05263]/75 bg-[#E05263]/18 text-[#FDA4AF]',
    seatIdleBorder: 'border-[#E05263]/32',
    seatActiveClasses:
      'border-[#FDA4AF] bg-[#281920]/95 shadow-[0_0_32px_rgba(224,82,99,0.42)]',
    haloClasses:
      'border-2 border-[#FDA4AF]/85 shadow-[0_0_26px_rgba(224,82,99,0.55),inset_0_0_14px_rgba(224,82,99,0.22)]',
    turnText: 'text-[#FDA4AF]',
    cardBackBorder: 'border-[#E05263]',
    cardSealBg: 'bg-[#E05263]',
    cardFrontRibbon: 'bg-[#E05263]',
  },
  emerald: {
    id: 'emerald',
    label: 'Esmeralda',
    swatchBg: 'bg-[#2EC28B]',
    monogramClasses: 'border-[#2EC28B]/75 bg-[#2EC28B]/18 text-[#6EE7B7]',
    seatIdleBorder: 'border-[#2EC28B]/32',
    seatActiveClasses:
      'border-[#6EE7B7] bg-[#0D3024]/95 shadow-[0_0_32px_rgba(46,194,139,0.42)]',
    haloClasses:
      'border-2 border-[#6EE7B7]/85 shadow-[0_0_26px_rgba(46,194,139,0.55),inset_0_0_14px_rgba(46,194,139,0.22)]',
    turnText: 'text-[#6EE7B7]',
    cardBackBorder: 'border-[#2EC28B]',
    cardSealBg: 'bg-[#2EC28B]',
    cardFrontRibbon: 'bg-[#2EC28B]',
  },
  amethyst: {
    id: 'amethyst',
    label: 'Amatista',
    swatchBg: 'bg-[#A87FF3]',
    monogramClasses: 'border-[#A87FF3]/75 bg-[#A87FF3]/18 text-[#DDD6FE]',
    seatIdleBorder: 'border-[#A87FF3]/32',
    seatActiveClasses:
      'border-[#DDD6FE] bg-[#1D1D33]/95 shadow-[0_0_32px_rgba(168,127,243,0.42)]',
    haloClasses:
      'border-2 border-[#DDD6FE]/85 shadow-[0_0_26px_rgba(168,127,243,0.55),inset_0_0_14px_rgba(168,127,243,0.22)]',
    turnText: 'text-[#DDD6FE]',
    cardBackBorder: 'border-[#A87FF3]',
    cardSealBg: 'bg-[#A87FF3]',
    cardFrontRibbon: 'bg-[#A87FF3]',
  },
  copper: {
    id: 'copper',
    label: 'Cobre',
    swatchBg: 'bg-[#E2834A]',
    monogramClasses: 'border-[#E2834A]/75 bg-[#E2834A]/18 text-[#FDBA74]',
    seatIdleBorder: 'border-[#E2834A]/32',
    seatActiveClasses:
      'border-[#FDBA74] bg-[#292018]/95 shadow-[0_0_32px_rgba(226,131,74,0.42)]',
    haloClasses:
      'border-2 border-[#FDBA74]/85 shadow-[0_0_26px_rgba(226,131,74,0.55),inset_0_0_14px_rgba(226,131,74,0.22)]',
    turnText: 'text-[#FDBA74]',
    cardBackBorder: 'border-[#E2834A]',
    cardSealBg: 'bg-[#E2834A]',
    cardFrontRibbon: 'bg-[#E2834A]',
  },
  teal: {
    id: 'teal',
    label: 'Turquesa',
    swatchBg: 'bg-[#2BBAC0]',
    monogramClasses: 'border-[#2BBAC0]/75 bg-[#2BBAC0]/18 text-[#99F6E4]',
    seatIdleBorder: 'border-[#2BBAC0]/32',
    seatActiveClasses:
      'border-[#99F6E4] bg-[#0D2C2F]/95 shadow-[0_0_32px_rgba(43,186,192,0.42)]',
    haloClasses:
      'border-2 border-[#99F6E4]/85 shadow-[0_0_26px_rgba(43,186,192,0.55),inset_0_0_14px_rgba(43,186,192,0.22)]',
    turnText: 'text-[#99F6E4]',
    cardBackBorder: 'border-[#2BBAC0]',
    cardSealBg: 'bg-[#2BBAC0]',
    cardFrontRibbon: 'bg-[#2BBAC0]',
  },
  rose: {
    id: 'rose',
    label: 'Coral',
    swatchBg: 'bg-[#E46B9C]',
    monogramClasses: 'border-[#E46B9C]/75 bg-[#E46B9C]/18 text-[#FBCFE8]',
    seatIdleBorder: 'border-[#E46B9C]/32',
    seatActiveClasses:
      'border-[#FBCFE8] bg-[#291924]/95 shadow-[0_0_32px_rgba(228,107,156,0.42)]',
    haloClasses:
      'border-2 border-[#FBCFE8]/85 shadow-[0_0_26px_rgba(228,107,156,0.55),inset_0_0_14px_rgba(228,107,156,0.22)]',
    turnText: 'text-[#FBCFE8]',
    cardBackBorder: 'border-[#E46B9C]',
    cardSealBg: 'bg-[#E46B9C]',
    cardFrontRibbon: 'bg-[#E46B9C]',
  },
};

export const PLAYER_COLOR_LIST: PlayerColorSpec[] = Object.values(PLAYER_COLORS);

export const DEFAULT_SEAT_COLORS: PlayerColorId[] = [
  'gold',
  'sapphire',
  'emerald',
  'copper',
  'amethyst',
  'rose',
];

export function getPlayerColor(colorId: PlayerColorId): PlayerColorSpec {
  return PLAYER_COLORS[colorId] ?? PLAYER_COLORS.gold;
}
