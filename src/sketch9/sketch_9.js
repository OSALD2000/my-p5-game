import Matter from "matter-js";


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  
export default (p, options = {}) => {
  let Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies;

  let engine, world;
  let objects = [];
  let hiddenBall;

  p.setup = () => {
    p.createCanvas(600, 900);
    engine = Engine.create();
    world = engine.world;

    // Wände: links, rechts, unten
    let wallThickness = 50;
    let ground = Bodies.rectangle(p.width / 2, p.height + wallThickness / 2, p.width, wallThickness, { isStatic: true });
    let leftWall = Bodies.rectangle(-wallThickness / 2, p.height / 2, wallThickness, p.height, { isStatic: true });
    let rightWall = Bodies.rectangle(p.width + wallThickness / 2, p.height / 2, wallThickness, p.height, { isStatic: true });

    World.add(world, [ground, leftWall, rightWall]);

    // Viele normale Bälle
    for (let i = 0; i < 670; i++) {
      let x = p.random(50, p.width - 50);
      let y = p.random(-600, -50);
      let r = p.random(15, 20);
      let circle = Bodies.circle(x, y, r, {
        restitution: 0.8,
        friction: 0.2,
        density: 0.001
      });
      Matter.Body.setMass(circle, 0.001);
      objects.push({ body: circle, radius: r, isHidden: false });
      objects = shuffleArray(objects);
      World.add(world, circle);
    }

    // Ball mit versteckter Zahl
    let x = p.random(100, p.width - 100);
    let y = p.random(-400, -100);
    let r = p.random(15, 20);
    hiddenBall = Bodies.circle(x, y, r, {
      restitution: 0.8,
      friction: 0.1,
      density: 0.001
    });
    Matter.Body.setMass(hiddenBall, 0.001);
    objects.push({ body: hiddenBall, radius: r, isHidden: true });
    World.add(world, hiddenBall);
  };

  p.draw = () => {
    p.background(255);
    Matter.Engine.update(engine);

    p.noStroke();

    for (let obj of objects) {
      let pos = obj.body.position;
      let angle = obj.body.angle;

      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(angle);
      p.fill(150);
      p.ellipse(0, 0, obj.radius * 2);

      if (obj.isHidden) {
        // Zahl „7“ im Ball
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(8);
        p.text("7", 0, 0);
      }

      p.pop();
    }
  };
};
