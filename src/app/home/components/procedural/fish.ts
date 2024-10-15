import { Vector2 } from "@shared/models";
import { Chain } from "./chain";

export class Fish {
  private readonly _chain: Chain;
  private _size: number;
  private _bodyWidth: number[] = [68, 81, 84, 83, 77, 64, 51, 38, 32, 19];
  draw() {}

  private _drawBody() {
    const points: Vector2[] = [];

    // Right half of the fish
    for (let i = 0; i < 10; i++) {
      const x = this.getPosX(i, Math.PI / 2, 0);
      const y = this.getPosY(i, Math.PI / 2, 0);
      points.push(new Vector2(x, y));
    }

    // Bottom of the fish (joining the halves)
    const bottomX = this.getPosX(9, Math.PI, 0);
    const bottomY = this.getPosY(9, Math.PI, 0);
    points.push(new Vector2(bottomX, bottomY));

    // Left half of the fish (reverse)
    for (let i = 9; i >= 0; i--) {
      const x = this.getPosX(i, -Math.PI / 2, 0);
      const y = this.getPosY(i, -Math.PI / 2, 0);
      points.push(new Vector2(x, y));
    }
  }

  getPosX(i: number, angleOffset: number, lengthOffset: number): number {
    const joint = this._chain.joints[i];
    return (
      joint.x + Math.cos(joint.angle + angleOffset) * (this._bodyWidth[i] + lengthOffset)
    );
  }

  getPosY(i: number, angleOffset: number, lengthOffset: number): number {
    const joint = this._chain.joints[i];
    return (
      joint.y + Math.sin(joint.angle + angleOffset) * (this._bodyWidth[i] + lengthOffset)
    );
  }
}
