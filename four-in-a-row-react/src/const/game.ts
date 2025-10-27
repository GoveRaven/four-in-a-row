export const GameStatus = {
  IN_PROGRESS: 'in-progress',
  START: 'start',
  END: 'end',
  DRAW: 'draw',
} as const;

export type TGameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export const MoveStatus = {
  INVALID: 'invalid',
  WIN: 'win',
  SUCCESS: 'success',
  DRAW: 'draw',
} as const;

export type TMoveStatus = (typeof MoveStatus)[keyof typeof MoveStatus];

export const PlayerColor = {
  NONE: 'none',
  YELLOW: 'yellow',
  RED: 'red',
} as const;

export type TPlayerColor = (typeof PlayerColor)[keyof typeof PlayerColor];

export const BoardDimensions = {
  ROWS: 6,
  COLUMNS: 7,
  WIN_LINE_LENGTH: 4,
} as const;

export type TBoardDimensions =
  (typeof BoardDimensions)[keyof typeof BoardDimensions];

export const BoardToken = {
  NONE: 0,
  YELLOW: 1,
  RED: 2,
} as const;

export type TBoardToken = (typeof BoardToken)[keyof typeof BoardToken];

export type TBoard = TBoardToken[][];

export type TScore = {
  player1: number;
  player2: number;
};
