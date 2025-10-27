type TGameObjectConfig = {
  x: number;
  y: number;
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
};

export class GameObject {
  protected x: number;
  public y: number;
  public width: number;
  public height: number;
  public context: CanvasRenderingContext2D;

  constructor({ context, x, y, width, height }: TGameObjectConfig) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  clear() {
    this.context.clearRect(this.x, this.y, this.width, this.height);
  }
}
