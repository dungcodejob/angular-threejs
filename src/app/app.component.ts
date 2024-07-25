import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoidsComponent } from './boids/boids.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoidsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-threejs';
}
