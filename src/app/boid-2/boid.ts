import { Vector2 } from '@shared/models';

export class Boid {
  static separationRange = 50;
  static separationFactor = 0.1;

  static alignmentRange = 50;
  static alignmentFactor = 0.1;

  static cohesionRange = 50;
  static cohesionFactor = 0.1;

  static paddingRange = 50;
  static turnFactor = 0.1;

  static maxSpeed = 4;
  static minSpeed = 2;

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
    const separationVelocity = this._separation(boids);
    const alignmentVelocity = this._alignment(boids);
    const cohesionVelocity = this._cohesion(boids);

    this.velocity
      .add(separationVelocity)
      .add(alignmentVelocity)
      .add(cohesionVelocity);

    this.position.add(this.velocity);

    let speed = this.velocity.magnitude();
    if (speed > Boid.maxSpeed) {
      this.velocity = this.velocity
        .divideScalar(speed)
        .multiplyScalar(Boid.maxSpeed);
    }

    if (speed < Boid.minSpeed) {
      this.velocity = this.velocity
        .divideScalar(speed)
        .multiplyScalar(Boid.minSpeed);
    }

    const turnVelocity = this._bounceOffWalls();
    this.velocity.add(turnVelocity);

    this.draw(this.content);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  private _separation(boids: Boid[]): Vector2 {
    let separationVelocity = new Vector2(0, 0);

    for (let boid of boids) {
      if (this.id === boid.id) {
        continue;
      }

      let distance = this.position.distanceTo(boid.position);
      if (distance < Boid.separationRange) {
        separationVelocity = separationVelocity.add(
          new Vector2(
            this.position.x - boid.position.x,
            this.position.y - boid.position.y
          )
        );
      }
    }

    separationVelocity = separationVelocity.multiplyScalar(
      Boid.separationFactor
    );

    return separationVelocity;
  }

  private _alignment(boids: Boid[]): Vector2 {
    let alignmentVelocity = new Vector2(0, 0);
    let numOfBoidsAlignWith = 0;
    for (let boid of boids) {
      if (this.id === boid.id) {
        continue;
      }

      let distance = this.position.distanceTo(boid.position);
      if (distance < Boid.alignmentRange) {
        alignmentVelocity = alignmentVelocity.add(boid.velocity);
        numOfBoidsAlignWith++;
      }
    }

    if (numOfBoidsAlignWith > 0) {
      alignmentVelocity = alignmentVelocity
        .divideScalar(numOfBoidsAlignWith)
        .multiplyScalar(Boid.alignmentFactor);
    }

    return alignmentVelocity;
  }

  private _cohesion(boids: Boid[]): Vector2 {
    let cohesionVelocity = new Vector2(0, 0);
    let positionToMoveToward = new Vector2(0, 0);
    let numOfBoidsInFlock = 0;
    for (let boid of boids) {
      if (this.id === boid.id) {
        continue;
      }

      let distance = this.position.distanceTo(boid.position);
      if (distance < Boid.cohesionRange) {
        positionToMoveToward = positionToMoveToward.add(boid.position);
        numOfBoidsInFlock++;
      }
    }

    if (numOfBoidsInFlock > 0) {
      cohesionVelocity = positionToMoveToward
        .divideScalar(numOfBoidsInFlock)
        .subtract(this.position)
        .multiplyScalar(Boid.cohesionFactor);
    }

    return cohesionVelocity;
  }

  private _bounceOffWalls(): Vector2 {
    const turnVelocity = new Vector2(0, 0);
    if (this.position.x < Boid.paddingRange) {
      turnVelocity.x += Boid.turnFactor;
    }

    if (this.position.x > this.width - Boid.paddingRange) {
      turnVelocity.x -= Boid.turnFactor;
    }

    if (this.position.y < Boid.paddingRange) {
      turnVelocity.y += Boid.turnFactor;
    }

    if (this.position.y > this.height - Boid.paddingRange) {
      turnVelocity.y -= Boid.turnFactor;
    }

    return turnVelocity;
  }
}
