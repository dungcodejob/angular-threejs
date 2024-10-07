import { Chain } from "./chain";

export class Fish {
  private readonly _chain: Chain;
  private _size: number;

  draw() {}

  // getPosX(i: number, angleOffset: number, lengthOffset: number): number {
  //   return (
  //     this._chain.at(i).position.x +
  //     Math.cos(this.spine.angles[i] + angleOffset) * (this.bodyWidth[i] + lengthOffset)
  //   );
  // }

  // getPosY(i: number, angleOffset: number, lengthOffset: number): number {
  //   return (
  //     this.spine.joints[i].y +
  //     Math.sin(this.spine.angles[i] + angleOffset) * (this.bodyWidth[i] + lengthOffset)
  //   );
  // }
}
