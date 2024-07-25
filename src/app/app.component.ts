import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Boid2Component } from './boid-2/boid-2.component';
import { BoidsComponent } from './boids/boids.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoidsComponent, Boid2Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-threejs';
}
