import { Vector2 } from "@shared/models";

export class Joint {
  position: Vector2;
  velocity: Vector2;

  constructor(position: Vector2, velocity: Vector2 = Vector2.zero()) {
    this.position = position;
    this.velocity = velocity;
  }

  move() {
    this.position.add(this.velocity);
  }

  clone() {
    return new Joint(this.position, this.velocity);
  }
}
