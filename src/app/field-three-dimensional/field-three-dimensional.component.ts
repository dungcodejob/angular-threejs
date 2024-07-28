import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import * as THREE from 'three';
@Component({
  selector: 'app-field-three-dimensional',
  standalone: true,
  imports: [],
  templateUrl: './field-three-dimensional.component.html',
  styleUrl: './field-three-dimensional.component.css',
})
export class FieldThreeDimensionalComponent implements OnInit, AfterViewInit {
  private readonly _document = inject(DOCUMENT);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private boids: Boid[] = [];
  private boundary: number = 50; // Giới hạn không gian
  ngOnInit() {
    this.initializeScene();
    this.initializeBoids();
  }

  ngAfterViewInit(): void {
    this.animate();
  }

  private initializeScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.z = 50;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this._document.body.appendChild(this.renderer.domElement);
  }

  private initializeBoids() {
    this.boids = [];
    for (let i = 0; i < 100; i++) {
      const boid = new Boid(this.boundary);
      this.boids.push(boid);
      this.scene.add(boid.mesh);
    }
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    for (let boid of this.boids) {
      boid.update(this.boids);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

class Boid {
  public mesh: THREE.Mesh;
  private velocity: THREE.Vector3;
  private acceleration: THREE.Vector3;
  private boundary: number;

  constructor(boundary: number) {
    const geometry = new THREE.ConeGeometry(1, 3, 3);
    const material = new THREE.MeshBasicMaterial({
      color:  0xffffff,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = Math.PI / 2;

    this.velocity = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    this.acceleration = new THREE.Vector3(0, 0, 0);

    this.mesh.position.set(
      Math.random() * boundary - boundary / 2,
      Math.random() * boundary - boundary / 2,
      Math.random() * boundary - boundary / 2
    );
    this.boundary = boundary;
  }

  public update(boids: Boid[]): void {
    // Implement flocking behavior here
    // For example, separation, alignment, and cohesion

    this.velocity.add(this.acceleration);
    this.mesh.position.add(this.velocity);
    this.acceleration.set(0, 0, 0);

    this.checkBounds();
  }

  private checkBounds(): void {
    if (
      this.mesh.position.x > this.boundary ||
      this.mesh.position.x < -this.boundary
    ) {
      this.velocity.x = -this.velocity.x;
    }
    if (
      this.mesh.position.y > this.boundary ||
      this.mesh.position.y < -this.boundary
    ) {
      this.velocity.y = -this.velocity.y;
    }
    if (
      this.mesh.position.z > this.boundary ||
      this.mesh.position.z < -this.boundary
    ) {
      this.velocity.z = -this.velocity.z;
    }
  }
}
