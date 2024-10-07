export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  // Add another vector to the current vector
  add(vector: Vector2): this {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  // Add a scalar to both components of the vector
  addScalar(scalar: number): this {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  // Subtract another vector from the current vector
  subtract(vector: Vector2): this {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  // Subtract a scalar from both components of the vector
  subtractScalar(scalar: number): this {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  // Multiply the current vector by another vector (element-wise multiplication)
  multiply(vector: Vector2): this {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }

  // Multiply both components of the vector by a scalar
  multiplyScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  // Divide the current vector by a scalar
  divideScalar(scalar: number): this {
    if (scalar === 0) {
      throw new Error("Division by zero is not allowed");
    }
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  // Normalize the vector (convert to a unit vector)
  normalize(): this {
    const mag = this.magnitude();
    if (mag !== 0) {
      this.x /= mag;
      this.y /= mag;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  // Calculate the magnitude (length) of the vector
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Calculate the dot product of two vectors
  dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  // Calculate the angle between two vectors (returns in radians)
  angleTo(vector: Vector2): number {
    const dotProd = this.dot(vector);
    const mags = this.magnitude() * vector.magnitude();
    return Math.acos(dotProd / mags);
  }

  // Calculate the distance to another vector
  distanceTo(vector: Vector2): number {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Create a string representation of the vector
  toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }
}
