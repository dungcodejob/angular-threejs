import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  model,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Vector2 } from '@shared/models';
import { fromEvent, merge, tap } from 'rxjs';
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
  private readonly _destroyRef = inject(DestroyRef);

  $canvas: Signal<ElementRef<HTMLCanvasElement>> = viewChild.required('canvas');
  $context = computed(() => this.$canvas().nativeElement.getContext('2d')!);

  shapeOptions = shapeOptions;

  private boids: Boid[] = [];
  private predators: Boid[] = [];

  private width = (window.innerWidth * 3) / 4;
  private height: number = (window.innerHeight * 3) / 4;

  $separationRange = model(20);
  separationFactor = 0.001;

  $alignmentRange = model(50);
  alignmentFactor = 0.01;

  $cohesionRange = model(50);
  cohesionFactor = 0.0003;

  $predatorRange = model(150);
  predatorFactor = 0.0007;

  paddingRange = 50;

  maxSpeed = 3;
  minSpeed = 1;
  turnFactor = (this.maxSpeed - this.minSpeed) / 20;

  $wrapType = model(WrapType.BounceOffWalls);
  $shape = model(Shape.Circle);
  $mousePosition = model({ x: 0, y: 0 });

  ngOnInit(): void {
    //TODO: thiết lập kẻ săn mồi
    this.setupCanvas();
    this.trackMousePosition();
    this.initializeFlock();
    this.animate();
  }

  private trackMousePosition(): void {
    const canvas = this.$canvas().nativeElement;
    const rect = canvas.getBoundingClientRect();
    merge(fromEvent(canvas, 'mousemove'), fromEvent(canvas, 'mousemove'))
      .pipe(
        tap((e) => {
          const event = e as MouseEvent;
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          this.$mousePosition.set({ x, y });
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
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

    // for (let i = 0; i < 3; i++) {
    //   const position = new Vector2(
    //     Math.random() * this.width,
    //     Math.random() * this.height
    //   );
    //   const velocity = new Vector2(
    //     Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed,
    //     Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
    //   );
    //   const boid = new Boid(i.toString(), position, velocity);
    //   this.predators.push(boid);
    // }
  }

  private animate(): void {
    const ctx = this.$context();
    ctx.clearRect(0, 0, this.width, this.height);

    for (const boid of this.boids) {
      const separationVelocity = this._separation(boid);
      const alignmentVelocity = this._alignment(boid);
      const cohesionVelocity = this._cohesion(boid);
      const predatorVelocity = this._predator(boid);

      boid.velocity
        .add(separationVelocity)
        .add(alignmentVelocity)
        .add(cohesionVelocity)
        .add(predatorVelocity);

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

    for (const predator of this.predators) {
      predator.position.add(predator.velocity);

      this._limitSpeed(predator);
      predator.velocity.multiplyScalar(0.75);

      if (this.$wrapType() === WrapType.BounceOffWalls) {
        const turnVelocity = this._bounceOffWalls(predator);
        predator.velocity.add(turnVelocity);
      }

      if (this.$wrapType() === WrapType.WrapAroundEdges) {
        this._wrapAround(predator);
      }
      predator.draw(ctx, this.$shape(), 'red');
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

  private _predator(currentBoid: Boid): Vector2 {
    let predatorVelocity = new Vector2(0, 0);

    for (let predator of this.predators) {
      let distance = currentBoid.position.distanceTo(predator.position);
      if (distance < this.$predatorRange()) {
        predatorVelocity.add(
          new Vector2(
            currentBoid.position.x - predator.position.x,
            currentBoid.position.y - predator.position.y
          )
        );
      }
    }
    const { x, y } = this.$mousePosition();
    let distanceMouse = currentBoid.position.distanceTo(new Vector2(x, y));

    if (distanceMouse < this.$predatorRange()) {
      predatorVelocity.add(
        new Vector2(currentBoid.position.x - x, currentBoid.position.y - y)
      );
    }

    predatorVelocity.multiplyScalar(this.predatorFactor);

    return predatorVelocity;
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
