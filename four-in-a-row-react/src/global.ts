import { Board, StatusArea, PlayAgainButton } from './components/index.js';
import {
  GameStatus,
  PlayAgainButtonConfig,
  MoveStatus,
  StatusMessage,
  PlayerColor,
  type TStatusMessage,
  GlobalConfig,
  StatusAreaConfig,
  BoardConfig,
  type TGameStatus,
  type TMoveStatus,
  type TScore,
} from './const/index.ts';
import {
  fourInARowGame,
  FourInARowGame,
} from './gameLogic/four-in-a-row-game.ts';
import { validator } from './gameLogic/validator.ts';

class Global {
  game: FourInARowGame;
  canvas: HTMLCanvasElement | null = null;
  width: number | null = null;
  height: number | null = null;
  context: CanvasRenderingContext2D | null = null;
  board!: Board;
  statusArea!: StatusArea;
  playAgainButton!: PlayAgainButton;
  gameOver: boolean = false;
  score: TScore = {
    player1: 0,
    player2: 0,
  };

  steps: number[] = [];

  constructor(game: FourInARowGame) {
    this.game = game;
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.canvas.style.background = GlobalConfig.GAME_BACKGROUND_COLOR;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas 2D context');
    this.context = ctx;

    this.setCanvasSize(320, 480);
  }

  private setCanvasSize(displayWidth: number, displayHeight: number) {
    if (!this.canvas) throw new Error('Canvas is undefined');

    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = displayWidth * dpr;
    this.canvas.height = displayHeight * dpr;

    this.context?.scale(dpr, dpr);

    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;

    this.width = displayWidth;
    this.height = displayHeight;
  }

  start() {
    this.statusArea = this.createStatusArea();
    this.board = this.createBoard();
    this.playAgainButton = this.createPlayAgainButton();
  }

  handleClick(offsetX: number, offsetY: number) {
    this.board.handleClick(offsetX, offsetY);
    this.playAgainButton?.handleClick(offsetX, offsetY);
  }

  createBoard(): Board {
    if (!this.context) throw new Error('Context is undefined');

    const board = new Board({
      context: this.context,
      x: BoardConfig.MARGIN_LEFT,
      y: this.statusArea.height + BoardConfig.MARGIN_TOP,
      width: BoardConfig.WIDTH,
      height: BoardConfig.HEIGHT,
    });
    board.columnSelectHandler((columnIndex: number) =>
      this.playMove(columnIndex)
    );
    board.render(this.game.currentBoard);
    return board;
  }

  createStatusArea(): StatusArea {
    if (!this.context || !this.width)
      throw new Error('Context or width are undefined');

    const statusArea = new StatusArea({
      context: this.context,
      x: 0,
      y: 0,
      width: this.width,
      height: StatusAreaConfig.HEIGHT,
    });
    statusArea.render(
      this.game.colorCurrentPlayerTurn,
      this.pickStatusMessage(this.game.status),
      this.score
    );
    return statusArea;
  }

  createPlayAgainButton(): PlayAgainButton {
    if (!this.context || !this.width || !this.height)
      throw new Error('Context, width or height are undefined');

    const buttonX = this.width / 2 - PlayAgainButtonConfig.WIDTH / 2;
    const buttonY = this.height - PlayAgainButtonConfig.MARGIN_BOTTOM;
    const button = new PlayAgainButton(
      this.context,
      buttonX,
      buttonY,
      PlayAgainButtonConfig.WIDTH,
      PlayAgainButtonConfig.HEIGHT
    );
    button.setClickHandler(() => this.reset());
    return button;
  }

  playMove(columnIndex: number) {
    const moveResult = this.game.playMove(columnIndex);
    this.processMoveResult(moveResult.status, columnIndex);
  }

  processMoveResult(moveResult: TMoveStatus, columnIndex: number) {
    if (this.gameOver || moveResult === MoveStatus.INVALID) return;
    this.steps.push(columnIndex + 1);

    const indicatorColor = this.determineIndicatorColor(moveResult);

    this.statusArea.render(
      indicatorColor,
      this.pickStatusMessage(this.game.status),
      this.score
    );
    this.board.render(this.game.currentBoard);

    if (moveResult === MoveStatus.WIN || moveResult === MoveStatus.DRAW) {
      this.gameOver = true;
    }

    if (this.gameOver) {
      validator(this.steps);
      this.playAgainButton.render();
    }
  }

  determineIndicatorColor(moveResult: TMoveStatus) {
    if (moveResult === MoveStatus.DRAW) {
      return PlayerColor.NONE;
    } else if (moveResult === MoveStatus.WIN) {
      const winner = this.game.colorCurrentPlayerTurn === PlayerColor.RED;
      this.score[winner ? 'player1' : 'player2']++;
      return winner ? PlayerColor.YELLOW : PlayerColor.RED;
    } else {
      return this.game.colorCurrentPlayerTurn;
    }
  }

  pickStatusMessage(status: TGameStatus): TStatusMessage {
    switch (status) {
      case GameStatus.END:
        return this.game.colorCurrentPlayerTurn === PlayerColor.YELLOW
          ? StatusMessage.RED_WIN
          : StatusMessage.YELLOW_WIN;
      case GameStatus.DRAW:
        return StatusMessage.DRAW;
      default:
        return this.game.colorCurrentPlayerTurn === PlayerColor.YELLOW
          ? StatusMessage.YELLOW_TURN
          : StatusMessage.RED_TURN;
    }
  }

  reset() {
    this.game = new FourInARowGame();
    this.gameOver = false;
    this.steps = [];

    this.playAgainButton.hide();
    this.statusArea.render(
      this.game.colorCurrentPlayerTurn,
      this.pickStatusMessage(this.game.status),
      this.score
    );
    this.board.render(this.game.currentBoard);
  }
}

export const global = new Global(fourInARowGame);
