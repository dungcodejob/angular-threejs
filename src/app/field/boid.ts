import { Vector2 } from '@shared/models';

export enum Shape {
  Triangle = 'triangle',
  Circle = 'circle',
}

export const shapeLabel: Record<Shape, string> = {
  [Shape.Circle]: 'Circle',
  [Shape.Triangle]: 'Triangle',
};

export const shapeOptions = Object.values(Shape).map((shape) => ({
  label: shapeLabel[shape],
  value: shape,
}));

export class Boid {
  id: string;
  position: Vector2;
  velocity: Vector2;
  width!: number;
  height!: number;
  content!: CanvasRenderingContext2D;
  constructor(id: string, position: Vector2, velocity: Vector2) {
    this.id = id;
    this.position = position;
    this.velocity = velocity;
  }

  update(boids: Boid[]): void {}

  /**
   * Draws a circle representing the boid on the canvas if the shape is set to Circle.
   * Draws the boid's velocity vector as a triangle on the canvas if the shape is set to Triangle.
   *
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {Shape} [shape=Shape.Circle] - The shape to draw on the canvas. Defaults to Circle.
   * @return {void} This function does not return anything.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    shape = Shape.Circle,
    Color = 'black'
  ): void {
    // Draws a circle representing the boid on the canvas.
    if (shape === Shape.Circle) {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = Color;
      ctx.fill();
      ctx.closePath();
    }

    // Draws the boid's velocity vector as a triangle on the canvas.
    if (shape === Shape.Triangle) {
      const angle = Math.atan2(this.velocity.y, this.velocity.x);
      const length = 10;
      const edge = 5;

      ctx.beginPath();
      ctx.moveTo(
        this.position.x + Math.cos(angle) * length,
        this.position.y + Math.sin(angle) * length
      );
      ctx.lineTo(
        this.position.x + Math.cos(angle + (2 * Math.PI) / 3) * edge,
        this.position.y + Math.sin(angle + (2 * Math.PI) / 3) * edge
      );
      ctx.lineTo(
        this.position.x + Math.cos(angle - (2 * Math.PI) / 3) * edge,
        this.position.y + Math.sin(angle - (2 * Math.PI) / 3) * edge
      );
      ctx.fillStyle = Color;
      ctx.fill();
      ctx.closePath();
    }
  }
}
