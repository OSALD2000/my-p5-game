
import Matter from 'matter-js';
import Element from './element';

const defeats = {
  "rock":["scissors"],
  "scissors":["paper"],
  "paper":["rock"],
}

export default (p, options = {}) => {
  const Engine = Matter.Engine;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;
  const Events = Matter.Events;
  const elementCount = options.elementCount || 3;

  let engine;
  let world;
  let firstTime = true;
  let canvasHeight = 900;
  let canvasWidth = 600;

  let elements = [];
  let walls = [];

  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    engine = Engine.create();
    world = engine.world;
    engine.gravity.y = 0;

    const thickness = 50;
    createElements(elementCount);
    walls.push(
      Bodies.rectangle(canvasWidth / 2, -thickness / 2, canvasWidth, thickness, { isStatic: true }),
    
      Bodies.rectangle(canvasWidth / 2, canvasHeight + thickness / 2, canvasWidth, thickness, { isStatic: true }),
    
      Bodies.rectangle(-thickness / 2, canvasHeight / 2, thickness, canvasHeight, { isStatic: true }),
    
      Bodies.rectangle(canvasWidth + thickness / 2, canvasHeight / 2, thickness, canvasHeight, { isStatic: true })
    );

    World.add(world, walls);

    Events.on(engine, 'collisionStart', (event) => {
      for (let pair of event.pairs) {
        let a = elements.find(e => e.body === pair.bodyA);
        let b = elements.find(e => e.body === pair.bodyB);
    
        if (a && b && a.type !== b.type) {
          if (defeats[a.type].includes(b.type)) {
            b.type = a.type;
          } else if (defeats[b.type].includes(a.type)) {
            a.type = b.type;
          }
          Body.setVelocity(a.body, { x: p.random(-5, 5), y: p.random(-5, 5) });
          Body.setVelocity(b.body, { x: p.random(-5, 5), y: p.random(-5, 5) });
        }
      }
    });
    
  }

  p.draw = () => {
    Engine.update(engine);
    p.background(0);

    elements.forEach(e => e.draw());
    
    p.stroke(100);
    p.noFill();
    for (let wall of walls) {
      const { vertices } = wall;
      p.beginShape();
      for (let v of vertices) {
        p.vertex(v.x, v.y);
      }
      p.endShape(p.CLOSE);
    }

    let winner = ['paper', 'scissors', 'rock'].find(type =>
      elements.every(e => e.type === type)
    );

    if (winner) {
      p.noLoop();
      p.fill(255);
      p.textSize(48);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`Winner: ${winner.toUpperCase()}`, canvasSize / 2, canvasSize / 2);
    }
  };

  const createElements = (n) =>{
    const types = ['paper', 'scissors', 'rock'];
    const quarterWidth = canvasWidth / 2;
    const quarterHeight = canvasHeight / 2;

    for (let i = 0; i < types.length; i++) {
      const type = types[i];

      for (let j = 0; j < n; j++) {
        let x = 0;
        let y = 0;

        if (i === 0) {
          x = p.random(0, quarterWidth);
          y = p.random(0, quarterHeight);
        } else if (i === 1) {
          x = p.random(quarterWidth, canvasWidth);
          y = p.random(0, quarterHeight);
        } else if (i === 2) {
          x = p.random(0, quarterWidth);
          y = p.random(quarterHeight, canvasHeight);
        }

        let element = new Element(x, y, type, world, p);
        elements.push(element);
      }
    }
  }
};
