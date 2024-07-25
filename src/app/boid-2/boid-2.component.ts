import {
  Component,
  ElementRef,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

@Component({
  selector: 'app-boid-2',
  standalone: true,
  imports: [],
  templateUrl: './boid-2.component.html',
  styleUrl: './boid-2.component.css',
})
export class Boid2Component implements OnInit {
  private readonly visualRange = 80;
  private readonly protectedRange = 8;
  private readonly maxSpeed = 10;
  private readonly minSpeed = 3;
  private readonly avoidFactor = 0.1;
  private readonly matchingFactor = 0.01;
  private readonly centeringFactor = 0.0005;
  private readonly turnFactor = 0.2;

  $canvas: Signal<ElementRef<HTMLCanvasElement>> = viewChild.required('canvas');
  private context!: CanvasRenderingContext2D;
  private readonly width: number = window.innerWidth /2;
  private readonly height: number = window.innerHeight/2;

  private readonly boids: Boid[] = [];

  ngOnInit(): void {
    this.setupCanvas();
    this.initializeFlock();
    this.animate();
  }
  private setupCanvas(): void {
    const canvas = this.$canvas().nativeElement;
    this.context = canvas.getContext('2d')!;
    canvas.width = this.width;
    canvas.height = this.height;
  }

  private initializeFlock(): void {
    for (let i = 0; i < 100; i++) {
      // this.flock.push({
      //   x: Math.random() * this.width,
      //   y: Math.random() * this.height,
      //   vx: Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed,
      //   vy: Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed,
      // });

      this.boids.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
      });
    }
  }

  private animate(): void {
    this.context.clearRect(0, 0, this.width, this.height);

    for (const boid of this.boids) {
      const separation = this.calculateSeparation(boid);
      const alignment = this.calculateAlignment(boid);
      const cohesion = this.calculateCohesion(boid);

      boid.vx += separation.x + alignment.x + cohesion.x;
      boid.vx += separation.y + alignment.y + cohesion.y;
    }

    for (const boid of this.boids) {
      if (boid.x > this.width - 100) {
        boid.vx += -this.turnFactor;
      }
      if (boid.x < 100) {
        boid.vx += this.turnFactor;
      }

      if (boid.y > this.height - 100) {
        boid.vy += -this.turnFactor;
      }
      if (boid.y < 100) {
        boid.vy += this.turnFactor;
      }

      const speed = Math.sqrt(boid.vx ** 2 + boid.vy ** 2);
      if (speed < this.minSpeed) {
        boid.vx = (boid.vx / speed) * this.minSpeed;
        boid.vy = (boid.vy / speed) * this.minSpeed;
      }

      if (speed > this.maxSpeed) {
        boid.vx = (boid.vx / speed) * this.maxSpeed;
        boid.vy = (boid.vy / speed) * this.maxSpeed;
      }

      boid.x += boid.vx;
      boid.y += boid.vy;

      this.context.beginPath();
      this.context.arc(boid.x, boid.y, 3, 0, Math.PI * 2);
      this.context.fillStyle = 'black';
      this.context.fill();
    }

    requestAnimationFrame(() => this.animate());
  }

  private calculateSeparation(currentBoid: Boid) {
    let x = 0;
    let y = 0;
    for (let boid of this.boids) {
      if (currentBoid.x != boid.x && currentBoid.y != boid.y) {
        const distance = this.calculateDistance(currentBoid, boid);
        if (this.isInRange(distance, this.protectedRange)) {
          x += currentBoid.x - boid.x;
          y += currentBoid.y - boid.y;
        }
      }
    }

    x = x * this.avoidFactor;
    y = y * this.avoidFactor;

    return { x, y };
  }

  private calculateAlignment(currentBoid: Boid) {
    let xVelocityAvg = 0;
    let yVelocityAvg = 0;
    let neighboringBoids = 0;

    for (let boid of this.boids) {
      if (currentBoid.x != boid.x && currentBoid.y != boid.y) {
        const distance = this.calculateDistance(currentBoid, boid);
        if (
          this.isInRange(distance, this.visualRange) &&
          !this.isInRange(distance, this.protectedRange)
        ) {
          xVelocityAvg += boid.vx;
          yVelocityAvg += boid.vy;
          neighboringBoids += 1;
        }
      }
    }

    if (neighboringBoids > 0) {
      xVelocityAvg = xVelocityAvg / neighboringBoids;
      yVelocityAvg = yVelocityAvg / neighboringBoids;

      return {
        x: (xVelocityAvg - currentBoid.vx) * this.matchingFactor,
        y: (yVelocityAvg - currentBoid.vy) * this.matchingFactor,
      };
    }

    return { x: 0, y: 0 };
  }

  private calculateCohesion(currentBoid: Boid) {
    let xPositionAvg = 0;
    let yPositionAvg = 0;
    let neighboringBoids = 0;

    for (let boid of this.boids) {
      if (currentBoid.x != boid.x && currentBoid.y != boid.y) {
        const distance = this.calculateDistance(currentBoid, boid);
        if (
          this.isInRange(distance, this.visualRange) &&
          !this.isInRange(distance, this.protectedRange)
        ) {
          xPositionAvg += boid.x;
          yPositionAvg += boid.y;
          neighboringBoids += 1;
        }
      }
    }

    if (neighboringBoids > 0) {
      xPositionAvg = xPositionAvg / neighboringBoids;
      yPositionAvg = yPositionAvg / neighboringBoids;

      return {
        x: (xPositionAvg - currentBoid.x) * this.centeringFactor,
        y: (yPositionAvg - currentBoid.y) * this.centeringFactor,
      };
    }

    return { x: 0, y: 0 };
  }

  private calculateDistance(currentBoid: Boid, otherBoid: Boid) {
    const dx = currentBoid.x - otherBoid.x;
    const dy = currentBoid.y - otherBoid.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  private isInRange(distance: number, range: number) {
    return distance ** 2 < range ** 2;
  }
}
