import * as Constants from './constants/index.js';

export default class FourInARowGame {
  startingColor;
  currentTurn;
  status;
  currentBoard;

  constructor() {
    this.startingColor = Constants.PlayerColor.YELLOW;
    this.currentTurn = this.startingColor;
    this.status = Constants.GameStatus.START;
    this.currentBoard = FourInARowGame.createBoard();
  }

  static createBoard() {
    let board = new Array(Constants.BoardDimensions.ROWS);

    for (let i = 0; i < Constants.BoardDimensions.ROWS; i++) {
      board[i] = new Uint8Array(Constants.BoardDimensions.COLUMNS);
      board[i].fill(Constants.BoardToken.NONE);
    }

    return board;
  }

  static playerColorToBoardToken(playerColor) {
    switch (playerColor) {
      case Constants.PlayerColor.YELLOW:
        return Constants.BoardToken.YELLOW;
      case Constants.PlayerColor.RED:
        return Constants.BoardToken.RED;
      default:
        return Constants.BoardToken.NONE;
    }
  }

  playMove(columnIndex) {
    switch (this.status) {
      case Constants.GameStatus.START:
        this.status = Constants.GameStatus.IN_PROGRESS;
        break;
      case Constants.GameStatus.DRAW:
      case Constants.GameStatus.WIN:
        return this.evaluateGame(this.currentBoard);
      default:
        break;
    }

    let moveResult = this.performMove(columnIndex);

    if (
      moveResult.status !== Constants.MoveStatus.INVALID &&
      moveResult.status.value !== Constants.MoveStatus.INVALID
    ) {
      this.currentTurn =
        this.currentTurn === Constants.PlayerColor.YELLOW
          ? Constants.PlayerColor.RED
          : Constants.PlayerColor.YELLOW;
    }

    return moveResult;
  }

  performMove(columnIndex) {
    let nextBoard = FourInARowGame.deepBoardCopy(this.currentBoard);

    let moveAttemptResult = this.tryPerformMove(columnIndex, nextBoard);

    if (moveAttemptResult.status === Constants.MoveStatus.INVALID) {
      return {
        board: nextBoard,
        winner: Constants.PlayerColor.NONE,
        status: {
          message: 'Returned column is filled',
          value: Constants.MoveStatus.INVALID,
        },
        winLine: [],
      };
    }

    this.currentBoard = moveAttemptResult.board;
    return this.evaluateGame(moveAttemptResult.board);
  }

  evaluateGame(board) {
    let winCheckResult = FourInARowGame.checkForWin(board);

    if (winCheckResult.winner !== Constants.PlayerColor.NONE) {
      this.status = Constants.GameStatus.WIN;
      return {
        board: board,
        winner: winCheckResult.winner,
        status: {
          value: Constants.MoveStatus.WIN,
        },
        winLine: winCheckResult.winLine,
      };
    }

    if (FourInARowGame.checkForFilledBoard(board)) {
      this.status = Constants.GameStatus.DRAW;

      return {
        board: board,
        winner: Constants.PlayerColor.NONE,
        status: {
          value: Constants.MoveStatus.DRAW,
        },
        winLine: [],
      };
    }

    return {
      board: board,
      winner: Constants.PlayerColor.NONE,
      status: {
        value: Constants.MoveStatus.SUCCESS,
      },
      winLine: [],
    };
  }

  static deepBoardCopy(oldBoard) {
    let newBoard = new Array(Constants.BoardDimensions.ROWS);

    for (
      let rowIndex = 0;
      rowIndex < Constants.BoardDimensions.ROWS;
      rowIndex++
    ) {
      newBoard[rowIndex] = new Uint8Array(Constants.BoardDimensions.COLUMNS);
      for (
        let columnIndex = 0;
        columnIndex < Constants.BoardDimensions.COLUMNS;
        columnIndex++
      ) {
        newBoard[rowIndex][columnIndex] = oldBoard[rowIndex][columnIndex];
      }
    }

    return newBoard;
  }

  tryPerformMove(columnIndex, nextBoard) {
    let isMoveValid = false;

    for (let i = nextBoard.length - 1; i > -1; i--) {
      let boardRow = nextBoard[i];
      let boardPosition = boardRow[columnIndex];

      if (boardPosition !== Constants.BoardToken.NONE) {
        continue;
      }

      boardRow[columnIndex] = FourInARowGame.playerColorToBoardToken(
        this.currentTurn
      );

      isMoveValid = true;
      break;
    }

    if (!isMoveValid) {
      return {
        status: Constants.MoveStatus.INVALID,
      };
    }

    return {
      status: Constants.MoveStatus.SUCCESS,
      board: nextBoard,
    };
  }

  static tryFindWinLine(board, options) {
    options = options || {};

    let config = {
      startRowIndex: options.startRowIndex || 0,
      startColumnIndex: options.startColumnIndex || 0,
      rowCountStep: options.rowCountStep || 0,
      columnCountStep: options.columnCountStep || 0,
    };

    let count = 0;
    let tokenToCheck = Constants.BoardToken.NONE;
    let winLine = [];

    for (let i = 0; i < Constants.BoardDimensions.WIN_LINE_LENGTH; i++) {
      let row = config.startRowIndex + config.rowCountStep * i;
      let column = config.startColumnIndex + config.columnCountStep * i;

      if (FourInARowGame.checkIfOutOfBounds(row, column)) {
        break;
      }

      let currentToken = board[row][column];
      if (currentToken === Constants.BoardToken.NONE) {
        break;
      }

      if (tokenToCheck === Constants.BoardToken.NONE) {
        tokenToCheck = currentToken;
      }

      if (currentToken === tokenToCheck) {
        count++;
      }

      winLine.push({ row: row, column: column });
    }

    if (count === Constants.BoardDimensions.WIN_LINE_LENGTH) {
      return {
        winLine: winLine,
        winner: FourInARowGame.boardTokenToPlayerColor(tokenToCheck),
      };
    }

    return {
      winLine: [],
    };
  }

  static checkIfOutOfBounds(row, column) {
    return (
      row < 0 ||
      row > Constants.BoardDimensions.ROWS ||
      column < 0 ||
      column > Constants.BoardDimensions.COLUMNS
    );
  }

  static boardTokenToPlayerColor(boardToken) {
    switch (boardToken) {
      case Constants.BoardToken.YELLOW:
        return Constants.PlayerColor.YELLOW;
      case Constants.BoardToken.RED:
        return Constants.PlayerColor.RED;
      default:
        return Constants.PlayerColor.NONE;
    }
  }

  static checkForWin(board) {
    for (
      let columnIndex = 0;
      columnIndex < Constants.BoardDimensions.COLUMNS;
      columnIndex++
    ) {
      for (
        let rowIndex = Constants.BoardDimensions.ROWS - 1;
        rowIndex > -1;
        rowIndex--
      ) {
        let verticalWinCheckResult = FourInARowGame.tryFindWinLine(board, {
          startRowIndex: rowIndex,
          startColumnIndex: columnIndex,
          rowCountStep: -1,
        });

        if (verticalWinCheckResult.winner) {
          return verticalWinCheckResult;
        }

        let horizontalWinCheckResult = FourInARowGame.tryFindWinLine(board, {
          startRowIndex: rowIndex,
          startColumnIndex: columnIndex,
          columnCountStep: -1,
        });

        if (horizontalWinCheckResult.winner) {
          return horizontalWinCheckResult;
        }

        let leftDiagonalWinCheck = FourInARowGame.tryFindWinLine(board, {
          startRowIndex: rowIndex,
          startColumnIndex: columnIndex,
          rowCountStep: -1,
          columnCountStep: -1,
        });

        if (leftDiagonalWinCheck.winner) {
          return leftDiagonalWinCheck;
        }

        let rightDiagonalWinCheck = FourInARowGame.tryFindWinLine(board, {
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
      winner: Constants.PlayerColor.NONE,
    };
  }

  static checkForFilledBoard(board) {
    for (let j = 0; j < board.length; j++) {
      let boardColumn = board[j];
      for (let i = 0; i < boardColumn.length; i++) {
        let boardPosition = boardColumn[i];
        if (boardPosition === Constants.BoardToken.NONE) {
          return false;
        }
      }
    }

    return true;
  }
}
