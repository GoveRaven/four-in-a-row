import { GameObject } from './game.ts';
import { PlayAgainButtonConfig, TextCongigs } from '../const/index.js';

type voidFunction = () => void;

export class PlayAgainButton extends GameObject {
  buttonClicked: voidFunction | null = null;
  isEnabled: boolean = false;

  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super({ context, x, y, width, height });
  }

  render() {
    this.context.save();
    this.renderBackground();
    this.context.restore();

    this.context.save();
    this.renderText();
    this.context.restore();

    this.isEnabled = true;
  }

  renderBackground() {
    const backgroundGradient = this.context.createLinearGradient(
      this.x,
      this.y,
      this.x,
      this.y + this.height
    );
    backgroundGradient.addColorStop(
      0,
      PlayAgainButtonConfig.BACKGROUND_START_COLOR
    );
    backgroundGradient.addColorStop(
      1,
      PlayAgainButtonConfig.BACKGROUND_END_COLOR
    );

    this.context.fillStyle = backgroundGradient;
    this.context.strokeStyle = `${PlayAgainButtonConfig.BORDER_WIDTH}px black`;
    this.context.fillRect(this.x, this.y, this.width, this.height);
    this.context.strokeRect(this.x, this.y, this.width, this.height);
  }

  clear() {
    const clearRectX = this.x - PlayAgainButtonConfig.BORDER_WIDTH;
    const clearRectY = this.y - PlayAgainButtonConfig.BORDER_WIDTH;
    const clearRectWidth = this.width + PlayAgainButtonConfig.BORDER_WIDTH * 2;
    const clearRectHeight =
      this.height + PlayAgainButtonConfig.BORDER_WIDTH * 2;

    this.context.clearRect(
      clearRectX,
      clearRectY,
      clearRectWidth,
      clearRectHeight
    );
  }

  renderText() {
    this.context.fillStyle = TextCongigs.FILL_STYLE;
    this.context.font = TextCongigs.FONT;
    this.context.textBaseline = TextCongigs.TEXT_BASE_LINE;
    this.context.textAlign = TextCongigs.TEXT_ALIGN;

    const textMetrics = this.context.measureText(PlayAgainButtonConfig.TEXT);
    const textHeight = textMetrics.actualBoundingBoxDescent;

    const finalTextY = this.y + this.height / 2 - textHeight / 2;

    this.context.fillText(
      PlayAgainButtonConfig.TEXT,
      this.x + PlayAgainButtonConfig.WIDTH / 2,
      finalTextY
    );
  }

  setClickHandler(handler: voidFunction) {
    this.buttonClicked = handler;
  }

  handleClick(offsetX: number, offsetY: number) {
    if (!this.isEnabled) {
      return;
    }

    const wasButtonClicked =
      offsetX >= this.x &&
      offsetX <= this.x + this.width &&
      offsetY >= this.y &&
      offsetY <= this.y + this.height;

    if (!wasButtonClicked) {
      return;
    }

    this.buttonClicked?.();
  }

  hide() {
    this.isEnabled = false;
    this.clear();
  }
}
