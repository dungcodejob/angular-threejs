import {
  Component,
  computed,
  ElementRef,
  model,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Vector2 } from '@shared/models';
import { Boid, Shape, shapeOptions } from './boid';

enum WrapType {
  BounceOffWalls = 'bounceOffWalls',
  WrapAroundEdges = 'wrapAroundEdges',
}

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './field.component.html',
  styleUrl: './field.component.css',
})
export class FieldComponent implements OnInit {
  $canvas: Signal<ElementRef<HTMLCanvasElement>> = viewChild.required('canvas');
  $context = computed(() => this.$canvas().nativeElement.getContext('2d')!);

  shapeOptions = shapeOptions;

  private boids: Boid[] = [];

  private width = (window.innerWidth * 3) / 4;
  private height: number = (window.innerHeight * 3) / 4;

  $separationRange = model(20);
  separationFactor = 0.001;

  $alignmentRange = model(50);
  alignmentFactor = 0.01;

  $cohesionRange = model(50);
  cohesionFactor = 0.0003;

  paddingRange = 50;

  maxSpeed = 3;
  minSpeed = 1;
  turnFactor = (this.maxSpeed - this.minSpeed) / 20;

  $wrapType = model(WrapType.BounceOffWalls);
  $shape = model(Shape.Circle);

  ngOnInit(): void {
    this.setupCanvas();
    this.initializeFlock();
    this.animate();
  }

  private setupCanvas(): void {
    const canvas = this.$canvas().nativeElement;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  private initializeFlock(): void {
    for (let i = 0; i < 100; i++) {
      const position = new Vector2(
        Math.random() * this.width,
        Math.random() * this.height
      );
      const velocity = new Vector2(
        Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed,
        Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
      );
      const boid = new Boid(i.toString(), position, velocity);
      this.boids.push(boid);
    }
  }

  private animate(): void {
    const ctx = this.$context();
    ctx.clearRect(0, 0, this.width, this.height);

    for (const boid of this.boids) {
      const separationVelocity = this._separation(boid);
      const alignmentVelocity = this._alignment(boid);
      const cohesionVelocity = this._cohesion(boid);

      boid.velocity
        .add(separationVelocity)
        .add(alignmentVelocity)
        .add(cohesionVelocity);

      boid.position.add(boid.velocity);

      this._limitSpeed(boid);

      if (this.$wrapType() === WrapType.BounceOffWalls) {
        const turnVelocity = this._bounceOffWalls(boid);
        boid.velocity.add(turnVelocity);
      }

      if (this.$wrapType() === WrapType.WrapAroundEdges) {
        this._wrapAround(boid);
      }

      boid.draw(ctx, this.$shape());
    }

    requestAnimationFrame(() => this.animate());
  }

  private _separation(currentBoid: Boid): Vector2 {
    let separationVelocity = new Vector2(0, 0);

    for (let boid of this.boids) {
      if (currentBoid.id === boid.id) {
        continue;
      }

      let distance = currentBoid.position.distanceTo(boid.position);
      if (distance < this.$separationRange()) {
        separationVelocity.add(
          new Vector2(
            currentBoid.position.x - boid.position.x,
            currentBoid.position.y - boid.position.y
          )
        );
      }
    }

    separationVelocity.multiplyScalar(this.separationFactor);

    return separationVelocity;
  }

  private _alignment(currentBoid: Boid): Vector2 {
    let alignmentVelocity = new Vector2(0, 0);
    let numOfBoidsAlignWith = 0;
    for (let boid of this.boids) {
      if (currentBoid.id === boid.id) {
        continue;
      }

      let distance = currentBoid.position.distanceTo(boid.position);
      if (distance < this.$alignmentRange()) {
        alignmentVelocity = alignmentVelocity.add(boid.velocity);
        numOfBoidsAlignWith++;
      }
    }

    if (numOfBoidsAlignWith > 0) {
      alignmentVelocity = alignmentVelocity
        .divideScalar(numOfBoidsAlignWith)
        .multiplyScalar(this.alignmentFactor);
    }

    return alignmentVelocity;
  }

  private _cohesion(currentBoid: Boid): Vector2 {
    let cohesionVelocity = new Vector2(0, 0);
    let positionToMoveToward = new Vector2(0, 0);
    let numOfBoidsInFlock = 0;
    for (let boid of this.boids) {
      if (currentBoid.id === boid.id) {
        continue;
      }

      let distance = currentBoid.position.distanceTo(boid.position);
      if (distance < this.$cohesionRange()) {
        positionToMoveToward = positionToMoveToward.add(boid.position);
        numOfBoidsInFlock++;
      }
    }

    if (numOfBoidsInFlock > 0) {
      cohesionVelocity = positionToMoveToward
        .divideScalar(numOfBoidsInFlock)
        .subtract(currentBoid.position)
        .multiplyScalar(this.cohesionFactor);
    }

    return cohesionVelocity;
  }

  private _bounceOffWalls(currentBoid: Boid): Vector2 {
    const turnVelocity = new Vector2(0, 0);
    if (currentBoid.position.x < this.paddingRange) {
      turnVelocity.x += this.turnFactor;
    }

    if (currentBoid.position.x > this.width - this.paddingRange) {
      turnVelocity.x -= this.turnFactor;
    }

    if (currentBoid.position.y < this.paddingRange) {
      turnVelocity.y += this.turnFactor;
    }

    if (currentBoid.position.y > this.height - this.paddingRange) {
      turnVelocity.y -= this.turnFactor;
    }

    return turnVelocity;
  }

  private _limitSpeed(boid: Boid) {
    let speed = boid.velocity.magnitude();
    if (speed > this.maxSpeed) {
      boid.velocity = boid.velocity
        .divideScalar(speed)
        .multiplyScalar(this.maxSpeed);
    }

    if (speed < this.minSpeed) {
      boid.velocity = boid.velocity
        .divideScalar(speed)
        .multiplyScalar(this.minSpeed);
    }
  }

  private _wrapAround(boid: Boid) {
    if (boid.position.x < 0) boid.position.x += this.width;
    if (boid.position.x > this.width) boid.position.x -= this.width;
    if (boid.position.y < 0) boid.position.y += this.height;
    if (boid.position.y > this.height) boid.position.y -= this.height;
  }
}
