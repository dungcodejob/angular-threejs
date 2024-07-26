import { Vector2 } from '../shared/models';

export class Boid {
  static separationRange = 8;
  static separationFactor = 0.1;

  static alignmentRange = 8;
  static alignmentFactor = 0.1;

  static cohesionRange = 8;
  static cohesionFactor = 0.1;

  static padding = 50;
  static turn = 0.2;

  id: string;
  position: Vector2;
  velocity: Vector2;

  constructor(id: string, position: Vector2, velocity: Vector2) {
    this.id = id;
    this.position = position;
    this.velocity = velocity;
  }

  update(boids: Boid[]) {
    const separation = this._separation(boids);
    const alignment = this._alignment(boids);
    const cohesion = this._cohesion(boids);

    this.velocity = this.velocity.add(separation).add(alignment).add(cohesion);

    this.position = this.position.add(this.velocity);
  }

  private _separation(boids: Boid[]): Vector2 {
    const separationVelocity = new Vector2(0, 0);

    for (const boid of boids) {
      if (this.id === boid.id) {
        continue;
      }

      const distance = this.position.distanceTo(boid.position);
      if (distance < Boid.separationRange) {
        separationVelocity.add(
          new Vector2(
            this.position.x - boid.position.x,
            this.position.y - boid.position.y
          )
        );
      }
    }

    separationVelocity.multiplyScalar(Boid.separationFactor);

    return separationVelocity;
  }

  private _alignment(boids: Boid[]): Vector2 {
    let alignmentVelocity = new Vector2(0, 0);
    let neighbors = 0;
    for (let boid of boids) {
      if (boid.id != this.id) {
        const distance = this.position.distanceTo(boid.position);
        if (distance < Boid.alignmentRange) {
          alignmentVelocity = alignmentVelocity.add(boid.velocity);
          neighbors++;
        }
      }
    }

    if (neighbors > 0) {
      alignmentVelocity = alignmentVelocity.divideScalar(neighbors);
    }

    return alignmentVelocity.multiplyScalar(Boid.alignmentFactor);
  }

  private _cohesion(boids: Boid[]): Vector2 {
    let cohesionVelocity = new Vector2(0, 0);
    let positionToMoveTowards = new Vector2(0, 0);
    let numOfBoidsInFlock = 0;
    for (let boid of boids) {
      if (boid.id != this.id) {
        const distance = this.position.distanceTo(boid.position);
        if (distance < Boid.cohesionRange) {
          positionToMoveTowards = positionToMoveTowards.add(boid.position);
          numOfBoidsInFlock++;
        }
      }
    }

    if (numOfBoidsInFlock > 0) {
      positionToMoveTowards =
        positionToMoveTowards.divideScalar(numOfBoidsInFlock);

      cohesionVelocity = positionToMoveTowards
        .subtract(this.position)
        .multiplyScalar(Boid.cohesionFactor);
    }

    return cohesionVelocity;
  }

  private _move(minSpeed: number, maxSpeed: number) {}

  private _bounceOffWalls() {
    if (this.position.x < Boid.padding) {
      this.velocity.x += Boid.turn;
    }

    if (this.position.x > window.innerWidth - Boid.padding) {
      this.velocity.x -= Boid.turn;
    }

    if (this.position.y < Boid.padding) {
      this.velocity.y += Boid.turn;
    }

    if (this.position.y > window.innerHeight - Boid.padding) {
      this.velocity.y -= Boid.turn;
    }
  }
}
