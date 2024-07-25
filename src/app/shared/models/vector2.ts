export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  // Add another vector to the current vector
  add(vector: Vector2): Vector2 {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  // Subtract another vector from the current vector
  subtract(vector: Vector2): Vector2 {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  // Multiply the current vector by a scalar
  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  // Calculate the magnitude (length) of the vector
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Normalize the vector (convert to a unit vector)
  normalize(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) {
      return new Vector2(0, 0);
    }
    return new Vector2(this.x / mag, this.y / mag);
  }

  // Calculate the dot product of two vectors
  dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  // Calculate the angle between two vectors (returns in radians)
  angleTo(vector: Vector2): number {
    const dotProd = this.dot(vector);
    const mags = this.magnitude() * vector.magnitude();
    return Math.acos(dotProd / mags);
  }

  // Create a string representation of the vector
  toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }
}
