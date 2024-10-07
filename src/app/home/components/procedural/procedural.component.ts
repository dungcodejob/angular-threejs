import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CanvasDrawer } from "@home/models/canvas-drawer";
import { Vector2 } from "@shared/models";
import { fromEvent, tap } from "rxjs";
import { Chain } from "./chain";
import { Joint } from "./joint";

@Component({
  selector: "app-procedural",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./procedural.component.html",
  styleUrl: "./procedural.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProceduralComponent implements OnInit, AfterViewInit {
  private readonly _$drawer = computed(
    () => new CanvasDrawer(this.$canvas().nativeElement.getContext("2d")!)
  );

  private readonly _$mousePosition = signal<Vector2>(new Vector2(0, 0));
  private readonly _elementRef = inject(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);
  private chain!: Chain;

  $canvas: Signal<ElementRef<HTMLCanvasElement>> = viewChild.required("canvas", {
    read: ElementRef<HTMLCanvasElement>,
  });
  $context = computed(() => this.$canvas().nativeElement.getContext("2d")!);
  $isSizeDisplay = signal(false);

  // circleOutPosition = new Vector2(0, 0);
  // circleInPosition = new Vector2(0, 0);
  // radiusOut = 50;
  // radiusIn = 5;
  // velocityOut = new Vector2(0, 0);
  // velocityIn = new Vector2(0, 0);
  maxSpeed = 3;

  ngOnInit(): void {
    this.setupCanvas();
    this.initializeChain();
    this.trackMousePosition();
    this.animate();
  }

  ngAfterViewInit(): void {
    throw new Error("Method not implemented.");
  }

  private setupCanvas(): void {
    const canvas = this.$canvas().nativeElement;
    canvas.width = this._elementRef.nativeElement.offsetWidth - 124;
    canvas.height = this._elementRef.nativeElement.offsetHeight - 124;
  }
  private trackMousePosition(): void {
    const canvas = this.$canvas().nativeElement;
    const rect = canvas.getBoundingClientRect();

    fromEvent(canvas, "mousedown")
      .pipe(
        tap(() => this.$isSizeDisplay.set(true)),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    fromEvent(canvas, "mouseup")
      .pipe(
        tap(() => this.$isSizeDisplay.set(false)),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    fromEvent(canvas, "mousemove")
      .pipe(
        tap(e => {
          const event = e as MouseEvent;
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          this._$mousePosition.set(new Vector2(x, y));
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();
  }

  private initializeChain(): void {
    const x = this.$canvas().nativeElement.width / 2;
    const y = this.$canvas().nativeElement.height / 2;

    const origin = new Joint(new Vector2(x, y));
    this.chain = new Chain(origin, 12, 50, Math.PI / 8);
  }

  private animate(): void {
    const ctx = this.$context();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const mousePosition = this._$mousePosition();

    this.chain.draw(this._$drawer(), mousePosition, this.$isSizeDisplay());

    requestAnimationFrame(() => this.animate());
  }
}
