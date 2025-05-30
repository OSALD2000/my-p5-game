import Matter from "matter-js";

export default (p, options = {}) => {
  const { Engine, World, Bodies, Body, Composite } = Matter;

  class Ball {
    constructor(x, y, id) {
      this.id = id;
      this.player = this.getRandomPlayer();
      this.color = this.player.css;
      this.name = this.player.name;
      
      this.body = Bodies.circle(
        x, 
        y, 
        15, 
        { 
          restitution: 0.7,
          friction: 0.0005,
          frictionAir: 0.001,
          render: { fillStyle: this.color }
        }
      );

      Body.setMass(this.body, p.random(3, 6));
    }

    getRandomPlayer() {
      const players = [
        { css: "#FF6B6B", name: "Emma" },    // Coral Pink
        { css: "#4ECDC4", name: "Almotasem" },   // Tiffany Blue
        { css: "#FFBE0B", name: "Sophia" }, // Amber
        { css: "#8338EC", name: "Noah" },   // Electric Purple
        { css: "#3A86FF", name: "Olivia" }, // Azure
        { css: "#FF006E", name: "Jacob" },  // Pink Raspberry
        { css: "#A2D2FF", name: "Mia" },    // Baby Blue
        { css: "#FF9E00", name: "Osama" },  // Orange Peel
        { css: "#CDB4DB", name: "Charlotte" }, // Lavender
        { css: "#2EC4B6", name: "Michael" }, // Turquoise
        { css: "#E71D36", name: "Amelia" }, // Crimson
        { css: "#662E9B", name: "Alexander" }, // Royal Purple
        { css: "#F4A261", name: "Harper" }, // Sandy Brown
        { css: "#70D6FF", name: "Roua" },  // Ice Blue
        { css: "#FF9770", name: "Elizabeth" }, // Atomic Tangerine
        { css: "#06D6A0", name: "Henry" },  // Caribbean Green
        { css: "#7209B7", name: "Scarlett" }, // Purple
        { css: "#3A0CA3", name: "Jackson" }, // Dark Blue
        { css: "#4361EE", name: "Grace" },  // Royal Blue
        { css: "#F72585", name: "Sebastian" }, // Fuchsia
        { css: "#4895EF", name: "Abo Malk" },  // Blue Jeans
        { css: "#560BAD", name: "Victoria" }, // Grape
        { css: "#480CA8", name: "Gabriel" }, // Violet
        { css: "#90BE6D", name: "Penelope" }, // Pistachio
        { css: "#43AA8B", name: "Wafaa" },  // Mint
        { css: "#4D908E", name: "Hannah" }, // Cadet Blue
        { css: "#277DA1", name: "John" },   // Ocean Blue
        { css: "#F9C74F", name: "Layla" },  // Mustard
        { css: "#577590", name: "Dylan" }   // Dark Gray Blue
      ];
      return players[Math.floor(Math.random() * players.length)];
    }
    
    draw(p) {
        p.noStroke();
        
        // Glow effect
        p.drawingContext.shadowBlur = 15;
        p.drawingContext.shadowColor = this.color;
        
        p.fill(this.color);
        p.circle(this.body.position.x, this.body.position.y, 30);
        
        // Reset shadow
        p.drawingContext.shadowBlur = 0;
        
        // Draw name
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(10);
        p.textStyle(p.BOLD);
        p.text(this.name, this.body.position.x, this.body.position.y);
      }
  
  }

  let engine, world;
  let balls = [];
  let obstacles = [];
  let stars = [];
  let scrollOffset = 0;
  let winner = null;
  let gamePhase = "countdown";
  let countdown = 3;
  let countdownTimer = 0;
  
  const effects = {
    screenShake: { intensity: 0, frames: 0 },
    slowMo: false
  };

  p.setup = () => {
    p.createCanvas(600, 900);
    engine = Engine.create({ 
      gravity: { y: 1.1 },
      enableSleeping: true
    });
    world = engine.world;
    
    generateStars(200);
    createBoundaries();
    createBalls(options.elementCount || 40);
    generateObstacles();
    
    Matter.Events.on(engine, 'collisionStart', handleCollisions);
  };
  
  function createBoundaries() {
    const wallOptions = { isStatic: true, render: { visible: false } };
    World.add(world, [
      Bodies.rectangle(300, -25, 600, 50, wallOptions), // Top wall - fixed width
      Bodies.rectangle(300, 8025, 600, 50, wallOptions), // Bottom wall - moved down
      Bodies.rectangle(-25, 4000, 50, 8000, wallOptions), // Left wall
      Bodies.rectangle(625, 4000, 50, 8000, wallOptions) // Right wall - fixed position
    ]);
  }

  function generateStars(count) {
    for (let i = 0; i < count; i++) {
      stars.push({
        x: p.random(p.width),
        y: p.random(8000), // Fixed to match finish line
        size: p.random(1, 3),
        twinkle: p.random(0.1, 0.3)
      });
    }
  }

  function createBalls(count) {
    const usedNames = new Set();
    
    for (let i = 0; i < count; i++) {
      let ball;
      let attempts = 0;
      do {
        ball = new Ball(
          p.random(50, 550), // Better spawn range
          50 + i * 20, // More spacing between balls
          i
        );
        attempts++;
      } while (usedNames.has(ball.name) && attempts < 100); 
      
      usedNames.add(ball.name);
      balls.push(ball);
      World.add(world, ball.body);
    }
  }

  function generateObstacles() {
    const styles = [
      { fill: "#FF9800", angle: 0.7 },
      { fill: "#E91E63", angle: 0.5 },
      { fill: "#673AB7", angle: 0.2 }
    ];
  
    for (let i = 0; i < 30; i++) {
      const y = 200 + i * 250; 
      const style = styles[i % styles.length];
      const gapX = p.random(150, 400); 
      const gapWidth = p.random(40, 90); 
  

      if (gapX > 40) { 

        const left = Bodies.rectangle(
          gapX / 2,
          y,
          gapX,
          20,
          {
            isStatic: true,
            angle: style.angle,
            render: { fillStyle: style.fill }
          }
        );
        obstacles.push(left);
        World.add(world, left);
      }
  
      const rightStart = gapX + gapWidth;
      if (rightStart < 600) { 
        const rightWidth = 600 - rightStart;
        const right = Bodies.rectangle(
          rightStart + rightWidth / 2,
          y,
          rightWidth,
          20,
          {
            isStatic: true,
            angle: -style.angle,
            render: { fillStyle: style.fill }
          }
        );
        obstacles.push(right);
        World.add(world, right);
      }
    }
  }
   
  function handleCollisions(event) {
    for (const pair of event.pairs) {
      if (pair.bodyA.circleRadius && pair.bodyB.circleRadius) {
        effects.screenShake = { intensity: 2, frames: 7 };
      }
    }
  }

  p.draw = () => {
    if (gamePhase === "countdown") {
      handleCountdown();
      return;
    } else if (gamePhase === "racing") {
      Engine.update(engine, effects.slowMo ? 1000/30 : 1000/60);
      checkWinner();
    }
    
    applyScreenShake();
    drawBackground();
    
    p.push();
    p.translate(0, -scrollOffset);
    
    drawObstacles();
    drawBalls();
    drawFinishLine();
    
    p.pop(); // Fixed: pop after drawing world elements
    
    drawUI();
  };

  function handleCountdown() {
    p.background(5, 10, 30);
    drawBackground();
    
    p.fill(255);
    p.textSize(120);
    p.textAlign(p.CENTER, p.CENTER);
    
    // Fixed countdown timer
    if (p.frameCount - countdownTimer >= 60) {
      countdown--;
      countdownTimer = p.frameCount;
    }
    
    if (countdown > 0) {
      p.text(countdown, p.width/2, p.height/2);
    } else if (countdown === 0) {
      p.text("GO!", p.width/2, p.height/2);
    } else {
      gamePhase = "racing";
    }
  }

  function applyScreenShake() {
    if (effects.screenShake.frames > 0) {
      p.translate(
        p.random(-effects.screenShake.intensity, effects.screenShake.intensity),
        p.random(-effects.screenShake.intensity, effects.screenShake.intensity)
      );
      effects.screenShake.frames--;
      effects.screenShake.intensity *= 0.9;
    }
  }

  function drawBackground() {
    p.background(5, 10, 30);
    
    p.noStroke();
    for (const star of stars) {
      const alpha = 255 * (0.5 + 0.5 * p.sin(p.frameCount * star.twinkle));
      p.fill(255, alpha);
      p.circle(star.x, star.y - scrollOffset * 0.7, star.size);
    }
  }

  function drawObstacles() {
    p.noStroke();
    for (const obs of obstacles) {
        p.push();
        p.translate(obs.position.x, obs.position.y);
        p.rotate(obs.angle);
        p.fill(obs.render.fillStyle);
        p.rectMode(p.CENTER);
        p.rect(0, 0, obs.bounds.max.x - obs.bounds.min.x, 20);
        p.pop();
    }
  }
  
  function drawBalls() {
    // Sort balls by Y position to draw them in correct order
    const sortedBalls = [...balls].sort((a,b) => a.body.position.y - b.body.position.y);
    
    for (const ball of sortedBalls) {
      ball.draw(p);
    }
    
    // Update scroll offset based on leading ball
    const leadingBall = balls.reduce((a, b) => 
      a.body.position.y > b.body.position.y ? a : b);
    scrollOffset = p.constrain(leadingBall.body.position.y - p.height/2, 0, 7500);
  }

  function drawFinishLine() {
    const finishY = 7500; // Adjusted finish line position
    p.stroke(0, 255, 0);
    p.strokeWeight(4);
    
    // Animated finish line
    for (let x = 0; x < p.width; x += 20) {
      const offset = p.sin((x + p.frameCount * 5) * 0.1) * 5;
      p.line(x, finishY + offset, x + 10, finishY + offset);
    }
    
    p.noStroke();
    p.fill(0, 255, 0, 50);
    p.rect(0, finishY - 10, p.width, 20);
    
    // Finish line text
    p.fill(255);
    p.textSize(24);
    p.textAlign(p.CENTER);
    p.text("🏁 ZIEL 🏁", p.width/2, finishY - 30);
  }

  function checkWinner() {
    const finishY = 7500;
    const winningBall = balls.find(b => b.body.position.y >= finishY - 20);
    
    if (winningBall && !winner) {
      winner = winningBall;
      gamePhase = "ended";
      effects.slowMo = true;
      
      // Stop the winning ball
      Body.setVelocity(winningBall.body, { x: 0, y: 0 });
      Body.setAngularVelocity(winningBall.body, 0);
    }
  }

  function drawUI() {
    // Ranking list
    const rankedBalls = [...balls]
      .sort((a,b) => b.body.position.y - a.body.position.y).slice(0,6);
    
    p.fill(0, 0, 0, 150);
    p.rect(10, 10, 180, 30 + rankedBalls.length * 25, 10);
    
    p.textSize(16);
    p.fill(255);
    p.textAlign(p.LEFT, p.CENTER);
    p.text("🏎️ RANGLISTE", 20, 30);
    
    p.textSize(14);
    rankedBalls.forEach((ball, i) => {
      const isLeading = i === 0;
      p.fill(isLeading ? ball.color : 255);
      p.textStyle(isLeading ? p.BOLD : p.NORMAL);
      
      p.text(`${i+1}. ${ball.name}`, 30, 55 + i * 25);
      
      // Color indicator
      p.noStroke();
      p.fill(ball.color);
      p.circle(20, 55 + i * 25, 8);
    });
    
    if (winner) {
      p.fill(0, 0, 0, 200);
      p.rect(0, 0, p.width, p.height);
      
      p.textAlign(p.CENTER);
      p.fill(winner.color);
      p.textSize(48);
      p.textStyle(p.BOLD);
      p.text(`🏆 ${winner.name}`, p.width/2, p.height/2 - 40);
      p.text("GEWINNT!", p.width/2, p.height/2);
      
      p.fill(255);
      p.textSize(20);
      p.textStyle(p.NORMAL);
      
      if (p.frameCount % 3 === 0) {
        for (let i = 0; i < 3; i++) {
          p.fill(p.random(255), p.random(255), p.random(255));
          p.circle(
            p.random(p.width),
            p.random(p.height/2 - 100, p.height/2 + 100),
            p.random(3, 8)
          );
        }
      }
    }
  }
};