import { Vector2 } from '@shared/models';

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

  update(boids: Boid[]): void {
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

}
