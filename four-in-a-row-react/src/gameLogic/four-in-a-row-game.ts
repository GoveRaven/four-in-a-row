import {
  BoardDimensions,
  BoardToken,
  GameStatus,
  MoveStatus,
  PlayerColor,
  type TBoard,
  type TBoardToken,
  type TGameStatus,
  type TMoveStatus,
  type TPlayerColor,
} from '../const/index';

type TWinLineOptions = {
  startRowIndex?: number;
  startColumnIndex?: number;
  rowCountStep?: number;
  columnCountStep?: number;
};

type TEvaluateGame = {
  board: TBoard;
  winner: TPlayerColor;
  status: TMoveStatus;
  winLine: { row: number; column: number }[];
};

export class FourInARowGame {
  startingColor: TPlayerColor = PlayerColor.YELLOW;
  colorCurrentPlayerTurn: TPlayerColor = this.startingColor;
  status: TGameStatus = GameStatus.START;
  currentBoard: TBoard = FourInARowGame.createBoard();

  static createBoard(): TBoard {
    return Array.from({ length: BoardDimensions.ROWS }, () => {
      const row = new Array(BoardDimensions.COLUMNS);
      row.fill(BoardToken.NONE);
      return row;
    });
  }

  static playerColorToBoardToken(playerColor: TPlayerColor) {
    switch (playerColor) {
      case PlayerColor.YELLOW:
        return BoardToken.YELLOW;
      case PlayerColor.RED:
        return BoardToken.RED;
      default:
        return BoardToken.NONE;
    }
  }

  playMove(columnIndex: number) {
    switch (this.status) {
      case GameStatus.START:
        this.status = GameStatus.IN_PROGRESS;
        break;
      case GameStatus.DRAW:
      case GameStatus.END:
        return this.evaluateGame(this.currentBoard);
      default:
        break;
    }

    const moveResult = this.performMove(columnIndex);

    if (moveResult.status !== MoveStatus.INVALID) {
      this.colorCurrentPlayerTurn =
        this.colorCurrentPlayerTurn === PlayerColor.YELLOW
          ? PlayerColor.RED
          : PlayerColor.YELLOW;
    }

    return moveResult;
  }

  performMove(columnIndex: number) {
    const nextBoard = FourInARowGame.deepBoardCopy(this.currentBoard);

    const moveAttemptResult = this.tryPerformMove(columnIndex, nextBoard);

    if (moveAttemptResult.status === MoveStatus.INVALID) {
      return {
        board: nextBoard,
        winner: PlayerColor.NONE,
        status: MoveStatus.INVALID,
        winLine: [],
      };
    }

    this.currentBoard = moveAttemptResult.board;
    return this.evaluateGame(moveAttemptResult.board);
  }

  evaluateGame(board: TBoard): TEvaluateGame {
    const winCheckResult = FourInARowGame.isWin(board);
    const moveResult: TEvaluateGame = {
      board,
      winner: PlayerColor.NONE,
      status: MoveStatus.INVALID,
      winLine: winCheckResult.winLine,
    };

    if (winCheckResult.winner !== PlayerColor.NONE) {
      this.status = GameStatus.END;
      moveResult.winner = winCheckResult.winner;
      moveResult.status = MoveStatus.WIN;
      moveResult.winLine = winCheckResult.winLine;
      return moveResult;
    }

    if (FourInARowGame.checkForFilledBoard(board)) {
      this.status = GameStatus.DRAW;
      moveResult.status = MoveStatus.DRAW;

      return moveResult;
    }
    moveResult.status = MoveStatus.SUCCESS;

    return moveResult;
  }

  static deepBoardCopy(oldBoard: TBoard) {
    const newBoard = new Array(BoardDimensions.ROWS);

    for (let rowIndex = 0; rowIndex < BoardDimensions.ROWS; rowIndex++) {
      newBoard[rowIndex] = new Uint8Array(BoardDimensions.COLUMNS);
      for (
        let columnIndex = 0;
        columnIndex < BoardDimensions.COLUMNS;
        columnIndex++
      ) {
        newBoard[rowIndex][columnIndex] = oldBoard[rowIndex][columnIndex];
      }
    }

    return newBoard;
  }

  tryPerformMove(columnIndex: number, nextBoard: TBoard) {
    let isMoveValid = false;

    for (let i = nextBoard.length - 1; i > -1; i--) {
      const boardRow = nextBoard[i];
      const boardPosition = boardRow[columnIndex];

      if (boardPosition !== BoardToken.NONE) {
        continue;
      }

      boardRow[columnIndex] = FourInARowGame.playerColorToBoardToken(
        this.colorCurrentPlayerTurn
      );

      isMoveValid = true;
      break;
    }

    if (!isMoveValid) {
      return {
        status: MoveStatus.INVALID,
      };
    }

    return {
      status: MoveStatus.SUCCESS,
      board: nextBoard,
    };
  }

  static tryFindWinLine(board: TBoard, options: TWinLineOptions = {}) {
    const config = {
      startRowIndex: options.startRowIndex || 0,
      startColumnIndex: options.startColumnIndex || 0,
      rowCountStep: options.rowCountStep || 0,
      columnCountStep: options.columnCountStep || 0,
    };

    let count = 0;
    let tokenToCheck: TBoardToken = BoardToken.NONE;
    const winLine = [];

    for (let i = 0; i < BoardDimensions.WIN_LINE_LENGTH; i++) {
      const row = config.startRowIndex + config.rowCountStep * i;
      const column = config.startColumnIndex + config.columnCountStep * i;

      if (FourInARowGame.isOutOfBounds(row, column)) {
        break;
      }

      const currentToken = board[row][column];
      if (currentToken === BoardToken.NONE) {
        break;
      }

      if (tokenToCheck === BoardToken.NONE) {
        tokenToCheck = currentToken;
      }

      if (currentToken === tokenToCheck) {
        count++;
      }

      winLine.push({ row, column });
    }

    if (count === BoardDimensions.WIN_LINE_LENGTH) {
      return {
        winLine,
        winner: FourInARowGame.boardTokenToPlayerColor(tokenToCheck),
      };
    }

    return {
      winLine: [],
    };
  }

  static isOutOfBounds(row: number, column: number) {
    return (
      row < 0 ||
      row > BoardDimensions.ROWS ||
      column < 0 ||
      column > BoardDimensions.COLUMNS
    );
  }

  static boardTokenToPlayerColor(boardToken: TBoardToken) {
    switch (boardToken) {
      case BoardToken.YELLOW:
        return PlayerColor.YELLOW;
      case BoardToken.RED:
        return PlayerColor.RED;
      default:
        return PlayerColor.NONE;
    }
  }

  static isWin(board: TBoard) {
    for (
      let columnIndex = 0;
      columnIndex < BoardDimensions.COLUMNS;
      columnIndex++
    ) {
      for (let rowIndex = BoardDimensions.ROWS - 1; rowIndex > -1; rowIndex--) {
        const verticalWinCheckResult = FourInARowGame.tryFindWinLine(board, {
          startRowIndex: rowIndex,
          startColumnIndex: columnIndex,
          rowCountStep: -1,
        });

        if (verticalWinCheckResult.winner) {
          return verticalWinCheckResult;
        }

        const horizontalWinCheckResult = FourInARowGame.tryFindWinLine(board, {
          startRowIndex: rowIndex,
          startColumnIndex: columnIndex,
          columnCountStep: -1,
        });

        if (horizontalWinCheckResult.winner) {
          return horizontalWinCheckResult;
        }

        const leftDiagonalWinCheck = FourInARowGame.tryFindWinLine(board, {
          startRowIndex: rowIndex,
          startColumnIndex: columnIndex,
          rowCountStep: -1,
          columnCountStep: -1,
        });

        if (leftDiagonalWinCheck.winner) {
          return leftDiagonalWinCheck;
        }

        const rightDiagonalWinCheck = FourInARowGame.tryFindWinLine(board, {
          startRowIndex: rowIndex,
          startColumnIndex: columnIndex,
          rowCountStep: -1,
          columnCountStep: 1,
        });

        if (rightDiagonalWinCheck.winner) {
          return rightDiagonalWinCheck;
        }
      }
    }

    return {
      winLine: [],
      winner: PlayerColor.NONE,
    };
  }

  static checkForFilledBoard(board: TBoard) {
    for (let j = 0; j < board.length; j++) {
      const boardColumn = board[j];
      for (const boardPosition of boardColumn) {
        if (boardPosition === BoardToken.NONE) {
          return false;
        }
      }
    }

    return true;
  }
}

export const fourInARowGame = new FourInARowGame();
