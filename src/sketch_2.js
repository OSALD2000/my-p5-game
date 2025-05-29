import Matter from 'matter-js';

export default (p) => {
  let Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body;

  let engine, world;
  let ball;
  let rings = [];
  let ringCount = 5;
  let gapSize = 60;
  let gameOver = false;
  let win = false;

  p.setup = () => {
    p.createCanvas(400, 600);
    engine = Engine.create();
    world = engine.world;
    engine.gravity.y = 1;

    ball = Bodies.circle(200, 50, 15, {
      restitution: 0.6,
      friction: 0.01
    });
    World.add(world, ball);

    for (let i = 0; i < ringCount; i++) {
      let y = 150 + i * 100;
      let angle = p.random(0, p.TWO_PI);
      rings.push({ y, angle, speed: 0.02 + i * 0.005 });
    }
  };

  p.draw = () => {
    Engine.update(engine);
    p.background(10);

    // Ball
    p.fill(255);
    p.ellipse(ball.position.x, ball.position.y, 30);

    // Ringe
    for (let ring of rings) {
      ring.angle += ring.speed;
      p.push();
      p.translate(p.width / 2, ring.y);
      p.rotate(ring.angle);
      p.noFill();
      p.stroke(255);
      p.strokeWeight(8);
      p.arc(0, 0, 150, 150, gapSize / 100, p.TWO_PI - gapSize / 100);
      p.pop();

      // Collision check
      if (
        ball.position.y > ring.y - 10 &&
        ball.position.y < ring.y + 10 &&
        Math.abs(((ring.angle % p.TWO_PI) - p.HALF_PI)) > 0.5
      ) {
        gameOver = true;
      }
    }

    if (gameOver) {
      p.noLoop();
      p.fill(255, 0, 0);
      p.textAlign(p.CENTER);
      p.textSize(32);
      p.text("Fast geschafft 😩", p.width / 2, p.height / 2);
    }

    if (ball.position.y > rings[rings.length - 1].y + 50 && !gameOver && !win) {
      win = true;
      p.noLoop();
      p.fill(0, 255, 0);
      p.textAlign(p.CENTER);
      p.textSize(32);
      p.text("Du hast es geschafft! 🔥", p.width / 2, p.height / 2);
    }
  };
};
