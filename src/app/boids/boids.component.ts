import {
  Component,
  ElementRef,
  OnInit,
  Signal,
  viewChild,
} from '@angular/core';
import { Boid } from './boid';

@Component({
  selector: 'app-boids',
  standalone: true,
  imports: [],
  templateUrl: './boids.component.html',
  styleUrl: './boids.component.css',
})
export class BoidsComponent implements OnInit {
  canvas: Signal<ElementRef<HTMLCanvasElement>> = viewChild.required('canvas', {
    read: ElementRef<HTMLCanvasElement>,
  });

  private ctx!: CanvasRenderingContext2D;
  private boids: Boid[] = [];

  ngOnInit(): void {
    this.ctx = this.canvas().nativeElement.getContext('2d')!;

    this.initializeBoids();
    this.animate();
  }

  private initializeBoids(): void {
    for (let i = 0; i < 100; i++) {
      this.boids.push(
        new Boid(
          Math.random() * this.canvas().nativeElement.width,
          Math.random() * this.canvas().nativeElement.height
        )
      );
    }
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(
      0,
      0,
      this.canvas().nativeElement.width,
      this.canvas().nativeElement.height
    );

    for (let boid of this.boids) {
      boid.update(this.boids);
      boid.draw(this.ctx);
    }
  }
}
