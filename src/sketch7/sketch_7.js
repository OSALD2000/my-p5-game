import Matter from "matter-js";

let targetRadius = 150;
let targetGapsize = Math.PI / 2;

class Ball {
  constructor(x, y, color, name, world, p, ballRadius = 20) {
    this.color = color;
    this.name = name;
    this.p = p;
    this.ballRadius = ballRadius;
    this.isAlive = true;
    this.body = Matter.Bodies.circle(x, y, ballRadius, {
      restitution: 1,
      friction: 0,
      frictionAir: 0.002,
    });
    Matter.Body.setVelocity(this.body, { x: p.random(-3, 3), y: p.random(-3, 3) });
    Matter.World.add(world, this.body);
    this.world = world;
  }

  draw() {
    const p = this.p;
    p.fill(this.color);
    p.noStroke();
    p.ellipse(this.body.position.x, this.body.position.y, this.ballRadius * 2);

    // Name zeichnen
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(16);
    p.text(this.name, this.body.position.x, this.body.position.y);
  }

  checkOutOfBounds(canvasWidth, canvasHeight) {
    const { x, y } = this.body.position;
    if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) {
      this.isAlive = false;
      Matter.World.remove(this.world, this.body);
    }
  }
}

class Ring {
  constructor(x, y, radius, order) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.speed = 0.01 + order * 0.0005;
    this.radius = radius;
    this.gapSize = Math.PI / 5;
  }

  update(p) {
    this.angle += this.speed;
  }

  draw(p) {
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.angle);
    p.stroke(255);
    p.noFill();
    p.strokeWeight(10);
    p.arc(0, 0, this.radius * 2, this.radius * 2, this.gapSize / 2, p.TWO_PI - this.gapSize / 2);
    p.pop();
  }

  checkCollision(ball) {
    const dx = ball.body.position.x - this.x;
    const dy = ball.body.position.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const innerBound = this.radius - ball.ballRadius;
    const outerBound = this.radius + ball.ballRadius;

    if (dist > innerBound && dist < outerBound) {
      const angleToBall = Math.atan2(dy, dx);
      const relativeAngle = (angleToBall - this.angle + 2 * Math.PI) % (2 * Math.PI);

      const gapStart = -this.gapSize / 2;
      const gapEnd = this.gapSize / 2;

      if (relativeAngle < (2 * Math.PI + gapStart) % (2 * Math.PI) || relativeAngle > (gapEnd + 2 * Math.PI) % (2 * Math.PI)) {
        // trifft auf Ring, nicht Gap → zurückstoßen nach innen
        const nx = -dx / dist;
        const ny = -dy / dist;
        Matter.Body.setVelocity(ball.body, { x: nx * 5, y: ny * 5 });
      }
    }
  }
}

export default (p) => {
  const { Engine, World } = Matter;
  let engine, world;
  const canvasWidth = 1000;
  const canvasHeight = 1000;

  let rings = [];
  let balls = [];

  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    engine = Engine.create();
    world = engine.world;
    engine.gravity.y = 1;

    // Ringe erzeugen
    const numRings = 5;
    const ringSpacing = 100;
    for (let i = 1; i <= numRings; i++) {
      rings.push(new Ring(canvasWidth / 2, canvasHeight / 2, i * ringSpacing, i));
    }

    // Ball in Mitte
    balls.push(new Ball(canvasWidth / 2, canvasHeight / 2, "orange", "🟠", world, p));
  };

  p.draw = () => {
    Engine.update(engine);
    p.background(5);

    // Ringe aktualisieren
    for (let ring of rings) {
      ring.update(p);
      ring.draw(p);
    }

    // Bälle zeichnen und prüfen
    for (let ball of balls) {
      if (!ball.isAlive) continue;

      for (let ring of rings) {
        ring.checkCollision(ball);
      }

      ball.checkOutOfBounds(canvasWidth, canvasHeight);
      ball.draw();
    }

    // Text bei Game Over
    if (balls.every((b) => !b.isAlive)) {
      p.fill(255, 0, 0);
      p.textSize(40);
      p.textAlign(p.CENTER);
      p.text("🟥 Verloren!", canvasWidth / 2, canvasHeight / 2);
    }
  };
};
