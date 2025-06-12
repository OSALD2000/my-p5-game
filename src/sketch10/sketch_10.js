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
  let showLevelScreen = true;
  let currentLevel = 1;
  const maxLevel = 5;
  let levelStartTime;

  p.setup = () => {
    p.createCanvas(600, 900);
    engine = Engine.create();
    world = engine.world;
    setupWalls();
    startLevel(currentLevel);
  };

  function setupWalls() {
    let thickness = 50;
    let ground = Bodies.rectangle(p.width / 2, p.height + thickness / 2, p.width, thickness, { isStatic: true });
    let leftWall = Bodies.rectangle(-thickness / 2, p.height / 2, thickness, p.height, { isStatic: true });
    let rightWall = Bodies.rectangle(p.width + thickness / 2, p.height / 2, thickness, p.height, { isStatic: true });
    World.add(world, [ground, leftWall, rightWall]);
  }

  function startLevel(level) {
    showLevelScreen = true;
    setTimeout(() => {
    showLevelScreen = false;
    // Entferne alte Objekte aus Welt & Liste
    for (let obj of objects) World.remove(world, obj.body);
    objects = [];

    // Ballanzahl und Größe skalieren
    let ballCount = level * 180;
    let ballRadius = p.map(level, 1, maxLevel, 20, 12);
    let brightness = p.map(level, 1, maxLevel, 0, 170);

    for (let i = 0; i < ballCount; i++) {
      let x = p.random(60, p.width - 60);
      let y = p.random(-600, -50);
      let r = ballRadius + p.random(-0.5 , 0.5);
      let ball = Bodies.circle(x, y, r, {
        restitution: 0.1,
        friction: 0.2,
        frictionAir: 0.01,
        density: 0.001
      });
        Matter.Body.setMass(ball, 0.1);

      objects.push({ body: ball, radius: r, isHidden: false, color: brightness });
      World.add(world, ball);
    }

    // Versteckten Ball (mit "7") einfügen
    let x = p.random(100, p.width - 100);
    let y = p.random(-400, -100);
    let r = ballRadius;
    hiddenBall = Bodies.circle(x, y, r, {
      restitution: 0.8,
      friction: 0.2,
      frictionAir: 0.01,
      density: 0.001
    });
    Matter.Body.setMass(hiddenBall, 0.1);
    
    objects.push({ body: hiddenBall, radius: r, isHidden: true, color: brightness });
    objects = shuffleArray(objects);
    World.add(world, hiddenBall);

    levelStartTime = p.millis();
        }, 2000);
  }

  p.draw = () => {
    p.background(240);
    Matter.Engine.update(engine);

    if (showLevelScreen) {
        p.background(0);
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(32);
        p.text(`Level ${currentLevel}`, p.width / 2, p.height / 2);
        return;
    }

    for (let obj of objects) {
      let pos = obj.body.position;
      let angle = obj.body.angle;

      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(angle);
      p.noStroke();
      p.fill(obj.color);

      if (obj.isHidden && p.millis() - levelStartTime > 8000 && currentLevel < maxLevel) {
        p.fill(p.color(255, 0, 0));
      }else{
        p.fill(obj.color);
      }
      let radius_multiplayer = p.map(currentLevel, 1, maxLevel, 1.8, 1.4);
      p.ellipse(0, 0, obj.radius * radius_multiplayer);

      if (obj.isHidden) {
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        let text_size = p.map(currentLevel, 1, maxLevel, 10, 7);
        p.textSize(text_size);
        p.text(currentLevel, 0, 0);
      }

      p.pop();
    }

    // Anzeige Level
    p.fill(0);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Level ${currentLevel}`, 10, 10);


    if (p.millis() - levelStartTime > 10000 && currentLevel < maxLevel) {
      currentLevel++;
      startLevel(currentLevel);
    }
  };
};
