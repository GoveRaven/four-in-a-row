export const StatusMessage = {
  DRAW: 'DRAW!',
  YELLOW_TURN: "YELLOW PLAYER'S TURN",
  RED_TURN: "RED PLAYER'S TURN",
  YELLOW_WIN: 'YELLOW PLAYER WINS!',
  RED_WIN: 'RED PLAYER WINS!',
} as const;

export type TStatusMessage =
  (typeof StatusMessage)[keyof typeof StatusMessage];
