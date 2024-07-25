export class Boid {
  static MAX_SPEED = 4;
  static NEIGHBOR_DISTANCE = 50;
  static SEPARATION_DISTANCE = 20;
  static ALIGNMENT_FACTOR = 0.1;
  static COHESION_FACTOR = 0.05;
  static SEPARATION_FACTOR = 0.15;

  x: number;
  y: number;
  vx: number;
  vy: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
  }

  update(boids: Boid[]): void {
    let alignment = this.align(boids);
    let cohesion = this.cohere(boids);
    let separation = this.separate(boids);

    this.vx += alignment.vx + cohesion.vx + separation.vx;
    this.vy += alignment.vy + cohesion.vy + separation.vy;

    // Giới hạn vận tốc
    let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > Boid.MAX_SPEED) {
      this.vx = (this.vx / speed) * Boid.MAX_SPEED;
      this.vy = (this.vy / speed) * Boid.MAX_SPEED;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Bọc boid quanh canvas
    if (this.x > 800) this.x = 0;
    if (this.y > 600) this.y = 0;
    if (this.x < 0) this.x = 800;
    if (this.y < 0) this.y = 600;
  }

  align(boids: Boid[]): { vx: number; vy: number } {
    let vx = 0;
    let vy = 0;
    let count = 0;

    for (let boid of boids) {
      let distance = this.distanceFrom(boid);
      if (distance > 0 && distance < Boid.NEIGHBOR_DISTANCE) {
        vx += boid.vx;
        vy += boid.vy;
        count++;
      }
    }

    if (count > 0) {
      vx /= count;
      vy /= count;
    }

    return { vx: vx * Boid.ALIGNMENT_FACTOR, vy: vy * Boid.ALIGNMENT_FACTOR };
  }

  cohere(boids: Boid[]): { vx: number; vy: number } {
    let x = 0;
    let y = 0;
    let count = 0;

    for (let boid of boids) {
      let distance = this.distanceFrom(boid);
      if (distance > 0 && distance < Boid.NEIGHBOR_DISTANCE) {
        x += boid.x;
        y += boid.y;
        count++;
      }
    }

    if (count > 0) {
      x /= count;
      y /= count;
    }

    return {
      vx: (x - this.x) * Boid.COHESION_FACTOR,
      vy: (y - this.y) * Boid.COHESION_FACTOR,
    };
  }

  separate(boids: Boid[]): { vx: number; vy: number } {
    let vx = 0;
    let vy = 0;

    for (let boid of boids) {
      let distance = this.distanceFrom(boid);
      if (distance > 0 && distance < Boid.SEPARATION_DISTANCE) {
        vx += this.x - boid.x;
        vy += this.y - boid.y;
      }
    }

    return { vx: vx * Boid.SEPARATION_FACTOR, vy: vy * Boid.SEPARATION_FACTOR };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  distanceFrom(boid: Boid): number {
    return Math.sqrt((this.x - boid.x) ** 2 + (this.y - boid.y) ** 2);
  }
}
