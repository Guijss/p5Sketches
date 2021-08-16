let starsX;
let starsY;
let spacingX, spacingY;
let noiseOffset;
let xStart;
let yStart;
let asteroids;
let spawnSides;
let shine;

function setup() {
  createCanvas(800, 600);
  starsX = 15;
  starsY = 15;
  spacingX = width / starsX;
  spacingY = height / starsY;
  noiseOffset = 1;
  xStart = 0;
  yStart = 0;
  asteroids = [];
  spawnSides = [0, 1, 2, 3];
  imgPicker = [0, 20, 40, 60];
  shine = 0;
}

function draw() {
  background(30);
  noStroke();
  for (let i = -1; i < starsX + 1; i++) {
    for (let j = -1; j < starsY + 1; j++) {
      let x = (i + xStart) * spacingX + (width - (starsX - 1) * spacingX) / 2;
      let adjustedX;
      if (x < -spacingX) {
        adjustedX =
          width + spacingX - (abs(x + spacingX) % (width + 2 * spacingX));
      } else if (x > width + spacingX) {
        adjustedX =
          -spacingX + ((x - width - spacingX) % (width + 2 * spacingX));
      } else {
        adjustedX = x;
      }
      let y = (j + yStart) * spacingY + (height - (starsY - 1) * spacingY) / 2;
      let adjustedY;
      if (y < -spacingY) {
        adjustedY =
          height + spacingY - (abs(y + spacingY) % (height + 2 * spacingY));
      } else if (y > height + spacingY) {
        adjustedY =
          -spacingY + ((y - height - spacingY) % (height + 2 * spacingY));
      } else {
        adjustedY = y;
      }
      let offsetX =
        spacingX * (2 * noise(i * noiseOffset, j * noiseOffset, 100) - 1);
      let offsetY =
        spacingY * (2 * noise(i * noiseOffset, j * noiseOffset, -100) - 1);
      // let r =
      //   offsetX > -spacingX / 3 ? 1 : offsetX > (-2 * spacingX) / 3 ? 2 : 3;
      let r = offsetX > 0 ? 1 : offsetX > -spacingX / 2 ? 2 : 3;
      let a = noise(shine);
      fill(200, 150);
      circle(adjustedX + offsetX, adjustedY + offsetY, r);
    }
  }
  const dirVec = p5.Vector.sub(
    createVector(mouseX, mouseY),
    createVector(width / 2, height / 2)
  ).div(width / 2);
  xStart -= dirVec.x * 0.02;
  yStart -= dirVec.y * 0.02;

  // if (frameCount % (5 * 60) == 0) {
  //   if (random() > 0.5) {
  //     let ax;
  //     let ay;
  //     let avel;
  //     const side = random(spawnSides);
  //     switch (side) {
  //       case 0: //left
  //         ax = -spacingX / 2;
  //         ay = random(0, height);
  //         break;
  //       case 1: //top
  //         ax = random(0, width);
  //         ay = -spacingY / 2;
  //         break;
  //       case 2: //right
  //         ax = width + spacingX / 2;
  //         ay = random(0, height);
  //         break;
  //       case 3: //bottom
  //         ax = random(0, width);
  //         ay = height + spacingY / 2;
  //         break;
  //       default:
  //         ax = 0;
  //         ay = 0;
  //         break;
  //     }
  //     let velVec = p5.Vector.sub(
  //       createVector(mouseX, mouseY),
  //       createVector(ax, ay)
  //     )
  //       .setMag(3)
  //       .rotate(random(-PI / 4, PI / 4));
  //     asteroids.push(new Particle(ax, ay, velVec));
  //   }
  // }
  // for (const asteroid of asteroids) {
  //   if (asteroid.outOfBounds) {
  //     asteroids.splice(asteroids.indexOf(asteroid), 1);
  //     continue;
  //   }
  //   asteroid.update();
  //   asteroid.render();
  // }
}

function setUp2dArr(a, b) {
  let arr = new Array(a);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(b);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = 1;
    }
  }
}

class Particle {
  constructor(x, y, vel) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.acc = createVector(0, 0);
    this.outOfBounds = false;
    this.angle = 0;
    this.rot = random([-0.01, 0.01]);
    this.r = floor(random(7, 9));
    this.sides = floor(random(7, 10));
    this.radii = new Array(this.sides).fill(0).map((a) => a = floor(random(this.r-1, this.r+1))); 
  }

  force() {
    this.acc.mult(0);
    const d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    if (d < 200 && d > 5) {
      let forceVec = p5.Vector.sub(createVector(mouseX, mouseY), this.pos);
      forceVec.setMag(5 / forceVec.mag());
      this.acc.add(forceVec);
    }
    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);
  }

  update() {
    if (
      this.pos.x < -spacingX ||
      this.pos.x > width + spacingX ||
      this.pos.y < -spacingY ||
      this.pos.y > height + spacingY
    ) {
      this.outOfBounds = true;
    }
    this.force();
  }

  render() {
    //circle(this.pos.x, this.pos.y, 15);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    fill(150);   
    beginShape();
    for (let i = 0; i < 2*PI; i += 2*PI/this.sides) {
      vertex(this.radii[this.sides * i / (2*PI)] * cos(i), this.radii[this.sides * i / (2*PI)] * sin(i));
    }
    endShape(CLOSE);
    pop();
    this.angle += this.rot;
  }  
}
