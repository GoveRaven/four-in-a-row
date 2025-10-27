export const GlobalConfig = {
  GAME_BACKGROUND_COLOR: '#122A67',
} as const;

export type TGlobalConfig = (typeof GlobalConfig)[keyof typeof GlobalConfig];

export const StatusAreaConfig = {
  HEIGHT: 120,
  PADDING_TOP: 40,
  INNER_MARGIN: 28,
  INDICATOR_WIDTH: 16,
} as const;

export type TStatusAreaConfig =
  (typeof StatusAreaConfig)[keyof typeof StatusAreaConfig];

export const BoardConfig = {
  WIDTH: 284,
  HEIGHT: 242,
  MARGIN_TOP: 20,
  MARGIN_LEFT: 18,
  HORIZONTAL_PADDING: 18,
  VERTICAL_PADDING: 16,
  SLOT_MARGIN: 8,
  SLOT_WIDTH: 28,
  BACKGROUND_COLOR: '#1D48B8',
  SLOT_OUTLINE_COLOR: '#225FFD',
} as const;

export type TBoardConfig = (typeof BoardConfig)[keyof typeof BoardConfig];

export const TokenColor = {
  NONE: '#D9D9D9',
  YELLOW: '#EAC02B',
  RED: '#EA2B2B',
} as const;

export type TTokenColor = (typeof TokenColor)[keyof typeof TokenColor];

export const PlayAgainButtonConfig = {
  WIDTH: 128,
  HEIGHT: 40,
  TEXT: 'Play Again',
  MARGIN_BOTTOM: 80,
  BORDER_WIDTH: 1,
  BACKGROUND_START_COLOR: '#225FFD',
  BACKGROUND_END_COLOR: '#1D48B8',
} as const;

export type TPlayAgainButtonConfig =
  (typeof PlayAgainButtonConfig)[keyof typeof PlayAgainButtonConfig];

export const TextCongigs = {
  FILL_STYLE: 'white',
  FONT: 'bold 16px Arial',
  TEXT_BASE_LINE: 'top',
  TEXT_ALIGN: 'center',
} as const;

export type TTextCongigs = (typeof TextCongigs)[keyof typeof TextCongigs];
