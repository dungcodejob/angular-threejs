<div align="center" style="margin-bottom:20px">
 
  <h2 style="font-weight:700">Boids Simulation</h2>
    <div align="center">
                       <a href="https://github.com/dungcodejob/angular-threejs/blob/production/LICENSE"><img src="https://img.shields.io/github/license/dungcodejob/angular-threejs?color=%234275f5&style=flat-square"/></a>
    </div>
</div>
           
> **This project is a simulation of the Boids algorithm implemented in Angular. The Boids algorithm models the flocking behavior of birds and creates a visually appealing animation of autonomous agents (boids) following simple rules to simulate complex behaviors.** 🚀


# Table of Contents

- [Algorithm ](#Algorithm)
  - [Terminology](#Terminology)
  - [Primary Rules](#Primary-Rules)
  - [Optional Rules](#Optional-Rules)
- [Installation](#Installation)
- [Customization](#Customization)
- [Contributing](#Contributing)
- [Support](#support)
- [License](#license)

## Algorithm

The Boids algorithm is a computational model developed by Craig Reynolds in 1986. It simulates the flocking behavior of birds using three primary rules applied to each boid:
- **Alignment:** boids move away from other boids that are too close
- **Cohesion:** boids attempt to match the velocities of their neighbors
- **Separation:** boids move toward the center of mass of their neighbors

### Terminology
- **Neighbors**: In the Boids algorithm, each boid only considers a subset of other boids, known as its neighbors, when calculating its new velocity and position. These neighbors are typically defined as all boids within a certain distance (range) of the current boid.
- **Range**: The range is the distance within which other boids are considered neighbors. If a boid is within this range, it influences the current boid's behavior according to the alignment, cohesion, and separation rules. The range helps in reducing the computational complexity by limiting the number of boids each boid needs to consider.
- **Factor**: Each rule (alignment, cohesion, and separation) has an associated factor that determines how strongly the rule influences the boid's behavior. These factors are used to weight the contributions of each rule when calculating the new velocity for the boid.

### Primary Rules
#### 1. Separation
Boids try to avoid collisions with their neighbors. This rule ensures that boids keep a small distance from each other by adjusting their velocity to move away from nearby boids if they are too close.
```typescript
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
```
#### 2. Alignment
Boids try to match the velocity (speed and direction) of their neighbors. This is achieved by calculating the average velocity of nearby boids and adjusting the boid's velocity to move in that direction.
``` typescript
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
```
#### 3. Cohesion
Boids try to stay close to their neighbors. This rule calculates the average position of nearby boids and adjusts the boid's velocity to move towards that average position.

```typescript
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
```
### Optional Rules
You can get fancy and apply additional rules to create even more complex and interesting behavior. In my example program I added 3 additional rules:

#### 4. Speed Limit
We constrain the boids to move faster than some minimum speed and slower than some maximum speed. We do so in the following way

```typescript
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
```
#### 5. Avoid Edges
This code accelerates boids away from walls with each iteration. Originally it just slows them down as they approach, but with more time they reverse course and travel away from the edge

```typescript
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
```
#### 6. Predator avoidance
Return the velocity adjustment needed to steer away from predators. In this example predators are simply defined as the first N boids using a class-level variable. Similar to the earlier boid avoidance method, this one summates avoidances based on each predator’s position instead of responding to the mean position of all predators.
```typescript
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

    predatorVelocity.multiplyScalar(this.predatorFactor);

    return predatorVelocity;
  }
```
## Installation
To get a local copy up and running, follow these steps:
-  **Clone the repository**:
```bash
git clone https://github.com/yourusername/boids-angular.git
cd boids-angular
```
- **Install dependencies**
```bash
npm install
```
- **Run the application**
```bash
ng serve

```
Open your browser and navigate to http://localhost:4200.
## Customization
You can adjust the simulation parameters using the controls provided in the user interface or customize the behavior of the boids by adjusting the parameters in the `field.component.ts`:

```typescript
  $separationRange = model(20);
  separationFactor = 0.001;

  $alignmentRange = model(50);
  alignmentFactor = 0.01;

  $cohesionRange = model(50);
  cohesionFactor = 0.0003;

  $predatorRange = model(150);
  predatorFactor = 0.0007;
```
## Contributing
Contributions are welcome! If you have suggestions for improving the project, feel free to fork the repository and create a pull request.

1. Fork the Project
   
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
   
3. Commit your Changes (git commit -m 'Add some AmazingFeature')

4. Push to the Branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

## Support

If you like my work, feel free to:

- ⭐ this repository. And we will be happy together :)

Thanks a bunch for supporting me!


## Project References & Credits

- [https://github.com/angular/angular](https://github.com/angular/angular)
- [https://swharden.com/csdv/simulations/boids](https://swharden.com/csdv/simulations/boids/)
- [https://vanhunteradams.com/Pico/Animal_Movement/Boids-algorithm](https://vanhunteradams.com/Pico/Animal_Movement/Boids-algorithm)


## License
This project is made available under the MIT license. See [LICENSE](https://github.com/dungcodejob/angular-threejs/blob/production/LICENSE.md) for details.
