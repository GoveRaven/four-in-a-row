import {
  StatusAreaConfig,
  PlayerColor,
  type TStatusMessage,
  TokenColor,
  type TPlayerColor,
  TextCongigs,
  type TScore,
} from '../const/index.ts';
import { GameObject } from './game.ts';

export class StatusArea extends GameObject {
  render(indicatorColor: TPlayerColor, message: TStatusMessage, score: TScore) {
    this.context.save();
    this.clear();

    if (indicatorColor !== PlayerColor.NONE) {
      this.renderPlayerTurnIndicator(indicatorColor);
    }

    this.renderMessage(message, score);
    this.context.restore();
  }

  renderMessage(message: TStatusMessage, score: TScore) {
    this.context.fillStyle = TextCongigs.FILL_STYLE;
    this.context.font = TextCongigs.FONT;
    this.context.textBaseline = TextCongigs.TEXT_BASE_LINE;
    this.context.textAlign = TextCongigs.TEXT_ALIGN;
    const messageY =
      this.y + StatusAreaConfig.PADDING_TOP + StatusAreaConfig.INNER_MARGIN;
    const scoreY = messageY + StatusAreaConfig.INNER_MARGIN;
    this.context.fillText(message, this.width / 2, messageY);
    this.context.fillText(
      `${score.player1}  |  ${score.player2}`,
      this.width / 2,
      scoreY
    );
  }

  renderPlayerTurnIndicator(indicatorColor: TPlayerColor) {
    let indicatorColorValue;

    switch (indicatorColor) {
      case PlayerColor.YELLOW:
        indicatorColorValue = TokenColor.YELLOW;
        break;
      case PlayerColor.RED:
        indicatorColorValue = TokenColor.RED;
        break;
      default:
        return;
    }

    this.context.fillStyle = indicatorColorValue;
    const indicatorY =
      this.y +
      StatusAreaConfig.INDICATOR_WIDTH / 2 +
      StatusAreaConfig.PADDING_TOP;
    this.context.beginPath();

    this.context.arc(
      this.width / 2,
      indicatorY,
      StatusAreaConfig.INDICATOR_WIDTH / 2,
      0,
      Math.PI * 2
    );

    this.context.closePath();
    this.context.fill();
  }
}
