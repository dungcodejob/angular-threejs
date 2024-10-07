import { Vector2 } from "@shared/models";

export class Joint {
  position: Vector2;
  velocity: Vector2;
  angle: number;

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  constructor(position: Vector2, velocity: Vector2 = Vector2.zero()) {
    this.position = position;
    this.velocity = velocity;
    this.angle = 0;
  }

  move() {
    this.position.add(this.velocity);
  }

  setPosition(position: Vector2) {
    this.position.x = position.x;
    this.position.y = position.y;
  }

  setVelocity(velocity: Vector2) {
    this.velocity.x = velocity.x;
    this.velocity.y = velocity.y;
  }

  clone() {
    return new Joint(this.position, this.velocity);
  }
}
