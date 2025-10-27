import { BoardToken, MoveStatus, PlayerColor } from '../const/index.js';
import { FourInARowGame } from './four-in-a-row-game';

const boardState = {
  WAITING: 'waiting',
  PENDING: 'pending',
  DRAW: 'draw',
  WIN: 'win',
} as const;

type TBoardState = (typeof boardState)[keyof typeof boardState];

type WinnerInfo = {
  who: 'player_1' | 'player_2';
  positions: number[][];
};

type StepInfo = {
  player_1: number[][];
  player_2: number[][];
  board_state: TBoardState;
  winner?: WinnerInfo;
};

type ValidatorResult = {
  [stepKey: `step_${number}`]: StepInfo;
};

export function validator(steps: number[]): ValidatorResult {
  const outputData: ValidatorResult = {
    step_0: { player_1: [], player_2: [], board_state: boardState.WAITING },
  };
  const gameLogic = new FourInARowGame();

  if (steps.length === 0) {
    return outputData;
  }

  for (let i = 0; i < steps.length; i++) {
    const prevStep = outputData[`step_${i}`] || outputData.step_0;
    const nextStep = structuredClone(prevStep);

    if (
      nextStep.board_state === boardState.DRAW ||
      nextStep.board_state === boardState.WIN
    ) {
      break;
    }

    nextStep.board_state = boardState.PENDING;
    const moveResult = gameLogic.playMove(steps[i] - 1);

    const col = steps[i];
    let row = -1;
    for (let r = 0; r < moveResult.board.length; r++) {
      if (moveResult.board[r][col - 1] !== BoardToken.NONE) {
        row = r;
        break;
      }
    }

    const correctRow = moveResult.board.length - 1 - row;
    if (i % 2 === 0) {
      nextStep.player_1.push([correctRow, col]);
    } else {
      nextStep.player_2.push([correctRow, col]);
    }
    if (moveResult.status === MoveStatus.WIN) {
      const formatedWinnerLine = moveResult.winLine.map((pos) => {
        const correctedY = moveResult.board.length - 1 - pos.row;
        return [pos.column, correctedY];
      });
      const winner =
        moveResult.winner === PlayerColor.YELLOW ? 'player_1' : 'player_2';
      nextStep.board_state = boardState.WIN;
      nextStep.winner = {
        who: winner,
        positions: formatedWinnerLine,
      };
    } else if (moveResult.status === MoveStatus.DRAW) {
      nextStep.board_state = boardState.DRAW;
    }

    outputData[`step_${i + 1}`] = nextStep;
  }
  console.log(outputData);
  return outputData;
}
