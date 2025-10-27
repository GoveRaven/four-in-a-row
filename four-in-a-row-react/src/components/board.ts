import { BoardConfig, TokenColor } from '../const/configs.js';
import { BoardDimensions, BoardToken, type TBoard } from '../const/index.ts';
import { GameObject } from './game.ts';

type TcolumnSelected = (columnIndex: number) => void;
export class Board extends GameObject {
  columnSelected: TcolumnSelected | null = null;
  render(nextBoard: TBoard) {
    this.context.save();
    this.clear();
    this.renderBoardBackground();
    this.renderSlots(nextBoard);
    this.context.restore();
  }

  renderBoardBackground() {
    this.context.fillStyle = BoardConfig.BACKGROUND_COLOR;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }

  renderSlot(x: number, y: number, radius: number, color: string) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.closePath();
    this.context.stroke();

    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius - 1, 0, Math.PI * 2);
    this.context.closePath();
    this.context.fill();
  }

  renderSlots(nextBoard: TBoard) {
    this.context.translate(
      this.x + BoardConfig.HORIZONTAL_PADDING,
      this.y + BoardConfig.VERTICAL_PADDING
    );
    this.context.strokeStyle = BoardConfig.SLOT_OUTLINE_COLOR;
    this.context.lineWidth = 2;

    const slotRadius = BoardConfig.SLOT_WIDTH / 2;

    for (let rowIndex = 0; rowIndex < BoardDimensions.ROWS; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < BoardDimensions.COLUMNS;
        columnIndex++
      ) {
        const totalSlotMarginsX = BoardConfig.SLOT_MARGIN * columnIndex;
        const totalPreviousSlotWidthsX = BoardConfig.SLOT_WIDTH * columnIndex;
        const slotX = totalSlotMarginsX + totalPreviousSlotWidthsX + slotRadius;

        const totalSlotMarginsY = BoardConfig.SLOT_MARGIN * rowIndex;
        const totalPreviousSlotWidthsY = BoardConfig.SLOT_WIDTH * rowIndex;
        const slotY = totalSlotMarginsY + totalPreviousSlotWidthsY + slotRadius;

        const tokenColorValue = nextBoard[rowIndex][columnIndex];

        let tokenColor;

        switch (tokenColorValue) {
          case BoardToken.YELLOW:
            tokenColor = TokenColor.YELLOW;
            break;
          case BoardToken.RED:
            tokenColor = TokenColor.RED;
            break;
          default:
            tokenColor = TokenColor.NONE;
            break;
        }

        this.renderSlot(slotX, slotY, slotRadius, tokenColor);
      }
    }
  }

  columnSelectHandler(callback: TcolumnSelected) {
    this.columnSelected = callback;
  }

  handleClick(offsetX: number, offsetY: number) {
    this.trySelectColumn(offsetX, offsetY);
  }

  trySelectColumn(offsetX: number, offsetY: number) {
    for (
      let columnIndex = 0;
      columnIndex < BoardDimensions.COLUMNS;
      columnIndex++
    ) {
      const totalSlotMargins = BoardConfig.SLOT_MARGIN * columnIndex;
      const totalPreviousSlotWidths = BoardConfig.SLOT_WIDTH * columnIndex;
      const columnX =
        this.x +
        BoardConfig.HORIZONTAL_PADDING +
        totalSlotMargins +
        totalPreviousSlotWidths;

      const wasColumnClicked =
        offsetX >= columnX &&
        offsetX <= columnX + BoardConfig.SLOT_WIDTH &&
        offsetY >= this.y + BoardConfig.VERTICAL_PADDING &&
        offsetY <= this.y + BoardConfig.HEIGHT - BoardConfig.VERTICAL_PADDING;

      if (wasColumnClicked) {
        this.columnSelected?.(columnIndex);
        break;
      }
    }
  }
}
