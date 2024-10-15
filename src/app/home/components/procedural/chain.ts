import { CanvasDrawer } from "@home/models";
import { Vector2 } from "@shared/models";
import { Joint } from "./joint";

export class Chain {
  private readonly _joints: Joint[] = [];

  get joints() {
    return this._joints;
  }

  private _size: number;
  private _maxAngle: number; // Max angle difference between adjacent joints
  constructor(origin: Joint, count: number, size: number, maxAngle: number) {
    this._size = size;
    this._joints.push(origin.clone());
    for (let i = 0; i < count; i++) {
      const joint = this._joints[i].clone();
      joint.position.add(new Vector2(0, size));
      this._joints.push(new Joint(Vector2.zero()));
    }

    this._maxAngle = maxAngle;
  }

  at(index: number) {
    return this._joints[index];
  }

  move(position: Vector2) {
    this._joints[0].position = position;
    this._joints[0].angle = new Vector2(0, 0)
      .add(position)
      .subtract(this._joints[0].position)
      .angle();

    for (let i = 1; i < this._joints.length - 1; i++) {
      const currentJoint = this._joints[i];
      const prevJoint = this._joints[i - 1];

      let angle = new Vector2(0, 0)
        .add(prevJoint.position)
        .subtract(currentJoint.position)
        .angle();

      // angle = this._limitAngle(angle, prevJoint.angle);

      // currentJoint.angle = angle;

      const distance = currentJoint.position.distanceTo(prevJoint.position);

      // currentJoint.position.subtract(this._fromAngle(angle).multiplyScalar(this._size));

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

  private _limitAngle(current: number, previous: number): number {
    // Tính góc chênh lệch giữa góc hiện tại và góc trước đó
    let angleDifference = current - previous;

    // Điều chỉnh góc chênh lệch vào khoảng [-PI, PI] để không vượt quá một vòng tròn
    angleDifference = ((angleDifference + Math.PI) % (2 * Math.PI)) - Math.PI;

    // Đảm bảo góc chênh lệch không vượt quá giá trị constraint (giới hạn góc)
    angleDifference = Math.max(
      -this._maxAngle,
      Math.min(this._maxAngle, angleDifference)
    );

    // Trả về góc hiện tại đã được giới hạn
    return previous + angleDifference;
  }

  private _fromAngle(angle: number): Vector2 {
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }
}
