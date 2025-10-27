import { Constants, FourInARowGame } from './index.js';

const boardState = {
  WAITING: 'waiting',
  PENDING: 'pending',
  DRAW: 'draw',
  WIN: 'win',
};

export function validator(steps) {
  const outputData = {
    step_0: { player_1: [], player_2: [], board_state: boardState.WAITING },
  };

  if (steps.length === 0) {
    console.log(outputData);
    return outputData;
  }
  const gameLogic = new FourInARowGame();

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

    const col = steps[i] - 1;
    let row = -1;
    for (let r = 0; r < moveResult.board.length; r++) {
      if (moveResult.board[r][col] !== Constants.BoardToken.NONE) {
        row = r;
        break;
      }
    }

    const correctRow = moveResult.board.length - 1 - row;
    if (i % 2 === 0) {
      nextStep.player_1.push([col, correctRow]);
    } else {
      nextStep.player_2.push([col, correctRow]);
    }
    if (gameLogic.status === Constants.GameStatus.WIN) {
      const formatedWinnerLine = moveResult.winLine.map((pos) => {
        const correctedY = moveResult.board.length - 1 - pos.row;
        return [pos.column, correctedY];
      });
      const winner =
        moveResult.winner === Constants.PlayerColor.YELLOW
          ? 'player_1'
          : 'player_2';
      nextStep.board_state = boardState.WIN;
      nextStep.winner = {
        who: winner,
        positions: formatedWinnerLine,
      };
    } else if (gameLogic.status === Constants.GameStatus.DRAW) {
      nextStep.board_state = boardState.DRAW;
    }

    outputData[`step_${i + 1}`] = nextStep;
  }

  console.log(outputData);
  return outputData;
}

// validator([1, 2, 1, 2, 3, 2]);
// validator([1, 2, 1, 2, 1, 2, 1]);
// validator([
//   1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5,
//   6, 7,
// ]);
// validator([
//   1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 2, 1, 4, 3, 6,
//   5, 1, 7, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7,
// ]);
// validator([])
