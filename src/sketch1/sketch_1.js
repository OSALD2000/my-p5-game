import Matter from "matter-js";

export default (p, options = {}) => {
  const Engine = Matter.Engine;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;

  var Ball = function(bodies, color, name, velocity_vector = { x: p.random(-5, 5), y: p.random(-5, 5) }) {
      this.bodies = bodies;
      this.color = color;
      this.name = name;
      Matter.Body.setVelocity(this.bodies, velocity_vector);
  }

  Ball.prototype.winCheck = function(finishY, ballRadius, winner) {
    return !winner && this.bodies.position.y >= finishY - ballRadius;
  }

  let engine;
  let world;

  let obstacles = [];
  let balls = [];
  let canvasHeight = 900;
  let canvasWidth = 600;
  let scrollOffset = 0;
  let winner = null;

  const ballRadius = 15;

  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    engine = Engine.create();
    world = engine.world;
    engine.gravity.y = 0.8;


    const wallThickness = 50;
    const bounds = [
      Bodies.rectangle(200, -wallThickness / 2, canvasWidth, wallThickness, { isStatic: true }),
      Bodies.rectangle(200, 10000 + wallThickness / 2, canvasWidth, wallThickness, { isStatic: true }),
      Bodies.rectangle(-wallThickness / 2, 3000, wallThickness, 10000, { isStatic: true }),
      Bodies.rectangle(canvasWidth + wallThickness / 2, 3000, wallThickness, 10000, { isStatic: true }),
    ];
    World.add(world, bounds);

    //createBalls(["محمد \n كرعة", "غابريل", "وليام", "كيرن", "نايف","خالد \n خريطة", "كرستيان  \nشالر", "ليفاندوسكي\n الاحمر", "يورغي"], "محمد \n كرعة");
    createBalls(["محمد \n كرعة", "وليام", "كرستيان  \nشالر"], "محمد \n كرعة");
    
    generateObstacles();
    
    balls.forEach(ball => World.add(world, ball.bodies))
  };

  function createBalls(names, favored)
  {
      names.forEach((n, i) =>{
        const isFavored = n.includes(favored);
        balls.push(new Ball(
          Bodies.circle(250 + p.random(-100, 100), 50 + i * 5, ballRadius, { restitution: isFavored ? 0.5 : 0.65, friction: isFavored ? 0.010 : 0.018, frictionAir: isFavored ? 0.00001 : 0.0001 }),
          getRandomColor(),
          n,
          isFavored 
          ? { x: p.random(-5, 10), y: p.random(5, 10) }
          : { x: p.random(-5, 5), y: p.random(-5, 5) }
        ));
      })
    }

  function generateObstacles() {
    for (let i = 2; i < 35; i++) {
      const y = i * 230;
      const angle = p.random(0.3, 0.5);
      const gapWidth = 35;
      const totalWidth = canvasWidth;
      const gapX = p.random(20, 380 - gapWidth);

      const leftWidth = gapX;
      const rightWidth = totalWidth - gapX - gapWidth;

      const leftObstacle = Bodies.rectangle(leftWidth / 2, y, leftWidth, 10, {
        isStatic: true,
        angle: angle,
      });

      const rightObstacle = Bodies.rectangle(gapX + gapWidth + rightWidth / 2, y, rightWidth, 10, {
        isStatic: true,
        angle: -angle,
      });

      obstacles.push(leftObstacle, rightObstacle);
      World.add(world, [leftObstacle, rightObstacle]);
    }
  }

  function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return [r, g, b];
  }

  p.draw = () => {
    Engine.update(engine);

    p.background(2);

    const leadingBall = balls.reduce((max, ball) => 
      ball.bodies.position.y > max.bodies.position.y ? ball : max, balls[0])
    const leadingBallY = leadingBall.bodies.position.y;

    scrollOffset = leadingBallY - p.height / 2;
    scrollOffset = p.max(0, scrollOffset);

    p.push();
    p.translate(0, -scrollOffset);

    p.fill(150);
    for (let obs of obstacles) {
      p.push();
      p.translate(obs.position.x, obs.position.y);
      p.rotate(obs.angle);
      p.rectMode(p.CENTER);
      p.rect(0, 0, obs.bounds.max.x - obs.bounds.min.x, 10);
      p.pop();
    }

    balls.forEach(ball => drawBall(ball.bodies, ball.color, ball.name))

    const finishY = 8000;
    p.stroke(0, 255, 0);
    p.strokeWeight(4);
    p.line(0, finishY, p.width, finishY);

    const w = balls.find(ball => ball.winCheck(finishY, ballRadius, winner));
    
    if (w){
      winner = w.name;
    }

    if (winner) {
      p.fill(255);
      p.textSize(32);
      p.textAlign(p.CENTER);
      p.text(`${winner} wins!`, p.width / 2, scrollOffset + 100);
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
      p.noLoop();
    }

    p.pop();
  };

  function drawBall(ball, color, name) {
    p.fill(...color);
    p.noStroke();
    p.ellipse(ball.position.x, ball.position.y, ballRadius * 2);
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(20);
    p.stroke(0);
    p.strokeWeight(3);
    p.fill(255);
    p.text(name, ball.position.x, ball.position.y);
    p.noStroke();
    p.fill(255);
    p.text(name, ball.position.x, ball.position.y);
  }
};