import p5 from 'p5';
import Matter from 'matter-js';

const { Engine, World, Bodies, Constraint, Events } = Matter;

let engine, world;
let ragdoll = [];
let balls = [];
let ground, platform;
let leftArm, rightArm;

let ballTimer = 0;
let waveTimer = 0;
let wave = 0;
let old_wave = 0;
let changed = false;
const maxWaves = 10;
const ballsPerWave = 500;
let firstTime = true;

let leftFoot;
let rightFoot;

let waitingForNextWave = true;
let zoom = 1;
let sound;
let recorder;
let recordedChunks = [];

function startRecording() {
  const canvasElement = document.querySelector("canvas");
  const canvasStream = canvasElement.captureStream(30);
  recorder = new MediaRecorder(canvasStream, {
        audio: true,
  });
  
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "recording.webm";
    a.click();
  };

  recorder.start();
  console.log("Recording started");

  setTimeout(() => {
    recorder.stop();
    console.log("Recording stopped");
  }, 52000);
}

export default(p)=> {
  p.setup = () => {
    p.createCanvas(400, 700);

    engine = Engine.create();
    world = engine.world;
    engine.gravity.y = 1;
    sound = new Audio("sounds/pop.mp3");
    // Boden
    ground = Bodies.rectangle(200, 700, 400, 40, { isStatic: true });
    // Plattform für Ragdoll
    platform = Bodies.rectangle(200, 400, 100, 10, { isStatic: true });
    World.add(world, [ground, platform]);

    createRagdoll(200, 360);
    spawnBallWave(ballsPerWave); // erste Welle
    ballTimer = p.millis();
    waveTimer = p.millis();

    Events.on(engine, 'collisionStart', (event) => {
        for (let pair of event.pairs) {
          let a = ragdoll.find(e => e === pair.bodyA);
          let b = balls.find(e => e === pair.bodyB);
            
          if (a && b){
            sound.play();
          }

        }
      });
      startRecording();
  };

  p.draw = () => {
    Engine.update(engine, 1000 / 120);
    const armSwingRange = 0.3;
    
    const time = performance.now() * 0.001;
    
    Matter.Body.setAngle(leftArm, armSwingRange * Math.sin(time * 2));
    Matter.Body.setAngularVelocity(leftArm, 0);
    
    Matter.Body.setAngle(rightArm, armSwingRange * Math.sin(time * 2 + Math.PI));
    Matter.Body.setAngularVelocity(rightArm, 0);
    
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.scale(zoom);
    p.translate(-p.width / 2, -p.height / 2);
    zoom += 0.000045;

    p.background(20);
    if (firstTime){
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(48);
        p.fill(255);
        p.text(`Wave: ${wave+1}`, p.width / 2, p.height / 4);
        if(p.millis() - waveTimer > 2000){
            waveTimer = p.millis();
            ballTimer = p.millis();
            firstTime = false;
            waitingForNextWave = false; 
        }
    }

    if(old_wave !== wave){
        firstTime = false;
        waitingForNextWave = true;
        
        p.textAlign(p.CENTER, p.TOP);
        p.textSize(48);
        p.fill(255);
        p.text(`Wave: ${wave+1}`, p.width / 2, p.height/4);

        if (p.millis() - ballTimer > 2000){
            old_wave = wave;
            waitingForNextWave = false;
        }
    }

    if(!waitingForNextWave){
        if (p.millis() - ballTimer > 5000 && wave < maxWaves - 1) {
            spawnBallWave(ballsPerWave);
            ballTimer = p.millis();
            waveTimer = p.millis();
            wave++;
        }
    }

    if (!changed && wave > 6){
        World.remove(world, [leftFoot, rightFoot]);
        changed = true;
    }
    for (let b of balls) {
        const r = b.circleRadius;
        const alpha = p.map(b.position.y, 0, p.height, 100, 255);
        p.fill(255, 100, 150, alpha);
        p.circle(b.position.x, b.position.y, r * 2);
      }

    p.fill(220, 0, 120);
    for (let part of ragdoll) {
      p.push();
      p.translate(part.position.x, part.position.y);
      p.rotate(part.angle);
      p.rectMode(p.CENTER);
      p.rect(0, 0, part.width, part.height);
      p.pop();
    }

    p.fill(120);
    p.rectMode(p.CENTER);
    p.rect(platform.position.x, platform.position.y, 100, 10);

    p.fill(80);
    p.rect(ground.position.x, ground.position.y, 400, 40);

    p.pop();
  };

  function spawnBallWave(count) {
    for (let i = 0; i < count; i++) {
      const size = p.random([4, 6, 10]);
      const density = size === 10 ? 0.005 : size === 6 ? 0.002 : 0.001;
      const restitution = p.random(0.6, 0.95);
  
      const side = p.random() < 0.5 ? 'top' : 'side';
      let x, y, vx = 0;
  
      if (side === 'top') {
        x = p.random(0, 400);
        y = p.random(-150, -10);
        vx = p.random(-1, 1);
      } else {
        x = p.random() < 0.5 ? -20 : 420;
        y = p.random(0, 500);
        vx = x < 0 ? p.random(2, 5) : p.random(-5, -2);
      }
  
      const b = Bodies.circle(x, y, size, {
        restitution: restitution,
        density: density,
        friction: 0.01,
      });
  
      Matter.Body.setVelocity(b, { x: vx, y: 0 });
      balls.push(b);
    }
    World.add(world, balls.slice(-count));
  
    if (balls.length > 500) {
      const removeCount = balls.length - 500;
      for (let i = 0; i < removeCount; i++) {
        World.remove(world, balls[i]);
      }
      balls.splice(0, removeCount);
    }
  }
  

  function createRagdoll(x, y) {
    const scale = 1;
  
    const head = Bodies.circle(x, y - 90, 15 * scale, {
      restitution: 0.3,
      density: 0.001,
    });
  
    const torso = Bodies.rectangle(x, y - 40, 20 * scale, 60 * scale, {
      restitution: 0.2,
      density: 0.002,
    });
  
    leftArm = Bodies.rectangle(x - 25, y - 50, 10, 30, {
      restitution: 0.2,
      density: 0.001,
    });
  
    rightArm = Bodies.rectangle(x + 25, y - 50, 10, 30, {
      restitution: 0.2,
      density: 0.001,
    });
  
    const leftLeg = Bodies.rectangle(x - 10, y + 10, 12, 40, {
      restitution: 0.2,
      density: 0.002,
    });
  
    const rightLeg = Bodies.rectangle(x + 10, y + 10, 12, 40, {
      restitution: 0.2,
      density: 0.002,
    });
  
    const parts = [head, torso, leftArm, rightArm, leftLeg, rightLeg];
    for (let part of parts) {
      part.width = part.bounds.max.x - part.bounds.min.x;
      part.height = part.bounds.max.y - part.bounds.min.y;
    }
  
    const joints = [
      Constraint.create({
        bodyA: head,
        bodyB: torso,
        pointA: { x: 0, y: 15 },
        pointB: { x: 0, y: -30 },
        stiffness: 1,
        damping: 0,
      }),
      Constraint.create({
        bodyA: torso,
        bodyB: leftArm,
        pointA: { x: -10, y: -25 },
        pointB: { x: 0, y: -15 },
        stiffness: 0.8,
        damping: 0.2,
      }),
      Constraint.create({
        bodyA: torso,
        bodyB: rightArm,
        pointA: { x: 10, y: -25 },
        pointB: { x: 0, y: -15 },
        stiffness: 0.8,
        damping: 0.2,
      }),
      Constraint.create({
        bodyA: torso,
        bodyB: leftLeg,
        pointA: { x: -5, y: 30 },
        pointB: { x: 0, y: -20 },
        stiffness: 0.9,
        damping: 0.2,
      }),
      Constraint.create({
        bodyA: torso,
        bodyB: rightLeg,
        pointA: { x: 5, y: 30 },
        pointB: { x: 0, y: -20 },
        stiffness: 0.9,
        damping: 0.2,
      }),
      Constraint.create({
        bodyA: leftLeg,
        bodyB: rightLeg,
        pointA: { x: 5, y: 20 },
        pointB: { x: -5, y: 20 },
        stiffness: 0.6,
        damping: 0.3,
      }),
    ];

    leftFoot=Constraint.create({
            bodyA: leftLeg,
            bodyB: platform,
            pointA: { x: 0, y: 20 },
            pointB: { x: -40, y: 0 },
            stiffness: 1,
            damping: 0.4,
          }),
    rightFoot = Constraint.create({
            bodyA: rightLeg,
            bodyB: platform,
            pointA: { x: 0, y: 20 },
            pointB: { x: 40, y: 0 },
            stiffness: 1,
            damping: 0.4,
          }),
    ragdoll = parts;
    World.add(world, [...ragdoll, ...joints, leftFoot, rightFoot]);
  }
};
