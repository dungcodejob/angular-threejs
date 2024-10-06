import { Vector2 } from "@shared/models";
export class CanvasDrawer {
  private readonly _ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }

  clear(): void {
    this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
  }

  line(start: Vector2, end: Vector2, color: string, width = 1): void {
    this._ctx.beginPath();
    this._ctx.moveTo(start.x, start.y);
    this._ctx.lineTo(end.x, end.y);
    this._ctx.lineWidth = width;
    this._ctx.strokeStyle = color;
    this._ctx.stroke();
    this._ctx.closePath();
  }
  circle(center: Vector2, radius: number, color: string, fill = false): void {
    this._ctx.beginPath();
    this._ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    if (fill) {
      this._ctx.fillStyle = color;
      this._ctx.fill();
    } else {
      this._ctx.strokeStyle = color;
      this._ctx.stroke();
    }
    this._ctx.closePath();
  }
}
