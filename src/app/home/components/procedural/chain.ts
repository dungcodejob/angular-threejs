import { CanvasDrawer } from "@home/models";
import { Vector2 } from "@shared/models";
import { Joint } from "./joint";

export class Chain {
  private readonly _joints: Joint[] = [];
  private _size: number;

  constructor(origin: Joint, count: number, size: number) {
    this._size = size;
    this._joints.push(origin.clone());
    for (let i = 0; i < count; i++) {
      const joint = this._joints[i].clone();
      joint.position.add(new Vector2(0, size));
      this._joints.push(new Joint(Vector2.zero()));
    }
  }

  move(position: Vector2) {
    this._joints[0].position = position;
    for (let i = 1; i < this._joints.length - 1; i++) {
      const currentJoint = this._joints[i];
      const prevJoint = this._joints[i - 1];

      const distance = currentJoint.position.distanceTo(prevJoint.position);

      if (distance > this._size) {
        currentJoint.position.add(
          new Vector2(
            prevJoint.position.x - currentJoint.position.x,
            prevJoint.position.y - currentJoint.position.y
          )
            .normalize()
            .multiplyScalar(distance - this._size)
        );
      }
    }
  }

  draw(drawer: CanvasDrawer, position: Vector2, isSizeDisplay: boolean) {
    this.move(position);

    drawer.circle(this._joints[0].position, 10, "black", true);
    if (isSizeDisplay) {
      drawer.circle(this._joints[0].position, this._size, "black");
    }
    for (let i = 1; i < this._joints.length - 1; i++) {
      const currentJoint = this._joints[i];
      const prevJoint = this._joints[i - 1];

      if (isSizeDisplay) {
        drawer.circle(currentJoint.position, this._size, "black");
      }

      drawer.circle(currentJoint.position, 10, "black", true);
      drawer.line(prevJoint.position, currentJoint.position, "black");
    }
  }
}
