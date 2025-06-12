import Matter, { Collision } from "matter-js";

export default (p, options = {}) => {
  const Engine = Matter.Engine;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;
  const Composite = Matter.Composite;
  const Render = Matter.Render;

  // Verbesserte Ball-Klasse mit mehr Eigenschaften
  var Ball = function(bodies, color, name, options = {}) {
      this.bodies = bodies;
      this.color = color;
      this.name = name;
      this.with_foto = options.with_foto || false;
      this.foto_name = options.foto_name || null;
      this.sparkle = 0;
      this.isWinner = false;
      this.trail = [];
      this.maxTrail = 20;
      
      if (options.velocity_vector) {
        Matter.Body.setVelocity(this.bodies, options.velocity_vector);
      }
      
      // Spezielle Eigenschaften für den Favoriten
      if (options.isFavored) {
        this.bodies.restitution = 0.8;
        this.bodies.friction = 0.001;
        this.bodies.frictionAir = 0.00001;
        this.glowColor = p.color(255, 215, 0); // Goldener Glow
      } else {
        this.glowColor = p.color(...color);
      }
  }

  Ball.prototype.update = function() {
    // Trail aktualisieren
    this.trail.push({x: this.bodies.position.x, y: this.bodies.position.y});
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }
    
    // Sparkle-Effekt aktualisieren
    this.sparkle = (this.sparkle + 0.05) % p.TWO_PI;
    
    // Gewinner-Effekt
    if (this.isWinner) {
      this.bodies.circleRadius = ballRadius * (1 + 0.1 * p.sin(p.frameCount * 0.1));
    }
  }

  Ball.prototype.winCheck = function(finishY, ballRadius, winner) {
    return !winner && this.bodies.position.y >= finishY - ballRadius;
  }

  let engine;
  let world;
  let render;
  let obstacles = [];
  let balls = [];
  let powerUps = [];
  let explosions = [];
  let canvasHeight = 900;
  let canvasWidth = 600;
  let scrollOffset = 0;
  let winner = null;
  let gameState = "racing"; // racing, winner, ended
  let frameCount = 0;
  let photos_louaded = {};
  let maskedFotoCache = {};
  let backgroundStars = [];
  let cameraShake = 0;
  let zoomFactor = 1;
  let plusObstacles = [];
  const plusObstacleSpacing = 400;

  const ballRadius = 23;
  const finishY = 5100;

  const alrahma_array = [
    {
      name: "البنزيموزليق",
      foto: "bnz.webp"
    },
    {
      name: "أبو شوقي",
      foto: "abo_shoky.webp"
    }
  ]

  for (let i = 0; i < 200; i++) {
    backgroundStars.push({
      x: p.random(canvasWidth),
      y: p.random(6000),
      size: p.random(1, 3),
      brightness: p.random(100, 255)
    });
  }

  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    p.frameRate(60);
    p.colorMode(p.RGB);
    
    engine = Engine.create({
      gravity: { x: 0, y: 0.8 },
      enableSleeping: true
    });
    
    world = engine.world;
    
    // Renderer für Debugging (kann auskommentiert werden)
    /*
    render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: canvasWidth,
        height: canvasHeight,
        wireframes: false,
        background: '#222'
      }
    });
    Render.run(render);
    */
    alrahma_array.forEach(item => {
      p.loadImage(`/pictures/${item.foto}`, (img) => {
        photos_louaded[item.foto] = img
      });
    });
    // Wände erstellen
    const wallThickness = 50;
    const bounds = [
      Bodies.rectangle(200, -wallThickness / 2, canvasWidth, wallThickness, { isStatic: true, render: { fillStyle: '#333' } }),
      Bodies.rectangle(200, 6000 + wallThickness / 2, canvasWidth, wallThickness, { isStatic: true, render: { fillStyle: '#333' } }),
      Bodies.rectangle(-wallThickness / 2, 3000, wallThickness, 6000, { isStatic: true, render: { fillStyle: '#333' } }),
      Bodies.rectangle(canvasWidth + wallThickness / 2, 3000, wallThickness, 6000, { isStatic: true, render: { fillStyle: '#333' } }),
    ];
    World.add(world, bounds);

    // Bälle erstellen
    createBallsWithFoto(shuffleArray(alrahma_array));
    
    // Hindernisse erstellen
    createPlusObstacles();
    
    // Power-Ups erstellen
    generatePowerUps();
    
    // Bälle zur Welt hinzufügen
    balls.forEach(ball => World.add(world, ball.bodies));
  };

  function createBallsWithFoto(names, favored) {
    names.forEach((n, i) => {
      const isFavored = n.name.includes(favored);
      const options = {
        with_foto: true,
        foto_name: n.foto,
        isFavored: isFavored,
        velocity_vector: isFavored 
          ? { x: p.random(-5, 10), y: p.random(5, 10) }
          : { x: p.random(-5, 5), y: p.random(-5, 5) }
      };
      
      const ballBody = Bodies.circle(
        250 + p.random(-100, 100), 
        50 + i * 5,
        ballRadius, 
        { 
          restitution: isFavored ? 0.8 : 0.65,
          friction: isFavored ? 0.001 : 0.018,
          frictionAir: isFavored ? 0.00001 : 0.00001,
          render: {
            fillStyle: isFavored ? 'gold' : getRandomHexColor()
          }
        }
      );
      
      balls.push(new Ball(
        ballBody,
        getRandomColor(),
        n.name,
        options
      ));
    });
  }

  function createPlusObstacles() {
    const obstacleCount = 10; // Anzahl der Plus-Hindernisse
    const thickness = 30; // Dicke der Plus-Arme
    
    for (let i = 0; i < obstacleCount; i++) {
      const centerX = canvasWidth / 2;
      const centerY = 500 + i * plusObstacleSpacing; // Vertikale Position
      
      // Horizontaler Balken
      const horizontal = Bodies.rectangle(centerX, centerY, canvasWidth, thickness, {
        isStatic: true,
        render: {
          fillStyle: getRandomNeonColor(),
          strokeStyle: '#FFFFFF',
          lineWidth: 2
        }
      });
      
      // Vertikaler Balken
      const vertical = Bodies.rectangle(centerX, centerY, thickness, canvasHeight, {
        isStatic: true,
        render: {
          fillStyle: getRandomNeonColor(),
          strokeStyle: '#FFFFFF',
          lineWidth: 2
        }
      });
      
      // Compound Body erstellen
      const plusObstacle = Body.create({
        parts: [horizontal, vertical],
        isStatic: true,
        position: { x: centerX, y: centerY },
        angle: p.random(p.TWO_PI), // Zufälliger Startwinkel
        rotationSpeed: p.random([-0.02, -0.01, 0.01, 0.02]), // Zufällige Drehgeschwindigkeit
        render: {
          fillStyle: '#FFFFFF'
        }
      });
      
      plusObstacles.push(plusObstacle);
      World.add(world, plusObstacle);
    }
  }
  
  function getRandomNeonColor() {
    const colors = [
      '#FF5555', '#55FF55', '#5555FF', 
      '#FFFF55', '#FF55FF', '#55FFFF',
      '#FFAA00', '#AA00FF', '#00AAFF'
    ];
    return colors[Math.floor(p.random(colors.length))];
  }
  

  function generatePowerUps() {
    for (let i = 0.3; i < 15; i+=0.3) {
      const y = i * 300 + p.random(0, 100);
      const x = p.random(100, canvasWidth - 100);
      
      const powerUp = Bodies.circle(x, y, 15, {
        isStatic: true,
        isSensor: true,
        render: {
          fillStyle: getRandomHexColor()
        },
        label: 'powerUp'
      });
      
      powerUps.push(powerUp);
      World.add(world, powerUp);
    }
  }

  function createExplosion(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const particle = Bodies.circle(x, y, p.random(2, 5), {
        restitution: 0.8,
        friction: 0.001,
        frictionAir: 0.01,
        density: 0.001,
        render: {
            fillStyle: p.color(
                p.random(150, 255),
                p.random(100, 200),
                p.random(50, 100)
            )
        },
        timeToLive: p.random(30, 60)
    });
    
      Body.setVelocity(particle, {
        x: p.random(-10, 10),
        y: p.random(-10, 10)
      });
      
      explosions.push(particle);
      World.add(world, particle);
    }
  }

  function getRandomColor() {
    const r = Math.floor(Math.random() * 206) + 50; // Hellere Farben
    const g = Math.floor(Math.random() * 206) + 50;
    const b = Math.floor(Math.random() * 206) + 50;
    return [r, g, b];
  }

  function getRandomHexColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  p.draw = () => {
    frameCount++;
    
    // Physik-Engine aktualisieren
    Engine.update(engine, 1000 / 60);
    
    // Kameraeffekte zurücksetzen
    p.translate(0, 0);
    p.rotate(0);
    
    // Hintergrund mit Parallax-Effekt
    drawBackground();
    
    // Kamerashake berechnen
    const shakeX = cameraShake > 0 ? p.random(-cameraShake, cameraShake) : 0;
    const shakeY = cameraShake > 0 ? p.random(-cameraShake, cameraShake) : 0;
    
    // Kamera transformieren
    p.translate(shakeX, shakeY);
    p.scale(zoomFactor);
    
    // Führenden Ball finden
    const leadingBall = balls.reduce((max, ball) => 
      ball.bodies.position.y > max.bodies.position.y ? ball : max, balls[0]);
    
    // Kamera scrollen
    scrollOffset = p.lerp(scrollOffset, leadingBall.bodies.position.y - p.height / 2, 0.1);
    scrollOffset = p.max(0, scrollOffset);
    
    p.push();
    p.translate(0, -scrollOffset);
    
    // Hindernisse zeichnen
    updatePlusObstacles();
  
    p.push();
    p.translate(0, -scrollOffset);
    
    // Plus-Hindernisse zeichnen
    drawPlusObstacles();
      
    // Power-Ups zeichnen
    drawPowerUps();
    
    // Explosionen zeichnen
    drawExplosions();
    
    // Bälle zeichnen
    balls.forEach(ball => {
      ball.update();
      ball.with_foto ? drawBallWithImage(ball) : drawBall(ball);
    });
    
    // Ziellinie zeichnen
    drawFinishLine();
    
    // Kollisionserkennung für Power-Ups
    checkPowerUpCollisions();
    
    // Gewinner überprüfen
    checkWinner();
    
    // UI zeichnen
    drawUI();
    
    p.pop();
    
    // Kamera-Effekte aktualisieren
    if (cameraShake > 0) cameraShake *= 0.9;
    if (zoomFactor !== 1) zoomFactor = p.lerp(zoomFactor, 1, 0.05);
  };

  function drawBackground() {
    // Verblassender Hintergrund
    p.background(5, 15, 25);
    
    // Sterne zeichnen mit Parallax-Effekt
    p.push();
    const starOffset = scrollOffset * 0.3;
    p.translate(0, -starOffset);
    
    for (const star of backgroundStars) {
      p.fill(star.brightness);
      p.noStroke();
      p.ellipse(star.x, star.y, star.size);
      
      // Funkeln
      if (p.random() < 0.01) {
        star.brightness = p.random(150, 255);
      }
    }
    p.pop();
  }

function drawPlusObstacles() {
  plusObstacles.forEach(plus => {
    p.push();
    p.translate(plus.position.x, plus.position.y);
    p.rotate(plus.angle);
    
    // Pulsierender Effekt
    const pulse = p.sin(frameCount * 0.05) * 0.1 + 1;
    p.drawingContext.shadowBlur = 20 * pulse;
    p.drawingContext.shadowColor = plus.parts[0].render.fillStyle;
    
    // Horizontaler Arm
    p.fill(plus.parts[0].render.fillStyle);
    p.noStroke();
    p.rectMode(p.CENTER);
    p.rect(0, 0, canvasWidth, 30, 5);
    
    // Vertikaler Arm
    p.fill(plus.parts[1].render.fillStyle);
    p.rect(0, 0, 30, canvasHeight, 5);
    
    p.drawingContext.shadowBlur = 0;
    
    // Mittelpunkt markieren
    p.fill(255, 255, 0);
    p.ellipse(0, 0, 20);
    
    p.pop();
  });
}

function updatePlusObstacles() {
  plusObstacles.forEach(plus => {
    Body.setAngle(plus, plus.angle + plus.rotationSpeed);
    Body.setPosition(plus, plus.position);
    
    // Optional: Geschwindigkeit erhöhen wenn Spieler näher kommt
    if (scrollOffset > plus.position.y - 1000) {
      plus.rotationSpeed *= 1.001;
    }
  });
}
  function drawPowerUps() {
    for (let pu of powerUps) {
      if (pu.isUsed) continue;
      
      p.push();
      p.translate(pu.position.x, pu.position.y);
      
      // Pulsierender Effekt
      const pulseSize = 15 * (1 + 0.1 * p.sin(frameCount * 0.1));
      
      // Glow-Effekt
      p.drawingContext.shadowBlur = 20;
      p.drawingContext.shadowColor = p.color(255, 255, 100);
      
      p.fill(255, 255, 0);
      p.ellipse(0, 0, pulseSize, pulseSize);
      
      p.drawingContext.shadowBlur = 0;
      
      // Sternform
      p.stroke(255, 200, 0);
      p.strokeWeight(2);
      p.noFill();
      drawStar(0, 0, 5, 10, 5);
      
      p.pop();
    }
  }

  function drawStar(x, y, radius1, radius2, npoints) {
    let angle = p.TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
      let sx = x + p.cos(a) * radius2;
      let sy = y + p.sin(a) * radius2;
      p.vertex(sx, sy);
      sx = x + p.cos(a + halfAngle) * radius1;
      sy = y + p.sin(a + halfAngle) * radius1;
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);
  }

  function drawExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        const exp = explosions[i];
        
        if (exp.timeToLive <= 0) {
            World.remove(world, exp);
            explosions.splice(i, 1);
            continue;
        }
        
        exp.timeToLive--;
        
        p.push();
        p.translate(exp.position.x, exp.position.y);
        
        // Partikel werden kleiner und durchsichtiger
        const alpha = p.map(exp.timeToLive, 0, 60, 0, 255);
        
        try {
            // Default fallback color (white)
            let fillColor = p.color(255);
            
            // Try to use the explosion color if valid
            if (exp.render && exp.render.fillStyle) {
                // If it's already a p5.Color object
                if (exp.render.fillStyle instanceof p5.Color) {
                    fillColor = exp.render.fillStyle;
                } 
                // If it's a hex string
                else if (typeof exp.render.fillStyle === 'string' && exp.render.fillStyle.startsWith('#')) {
                    fillColor = p.color(exp.render.fillStyle);
                }
                // If it's an RGB array
                else if (Array.isArray(exp.render.fillStyle) && exp.render.fillStyle.length >= 3) {
                    fillColor = p.color(...exp.render.fillStyle);
                }
            }
            
            p.fill(
                p.red(fillColor),
                p.green(fillColor), 
                p.blue(fillColor),
                alpha
            );
            
            p.noStroke();
            const size = p.map(exp.timeToLive, 0, 60, 1, exp.circleRadius * 2);
            p.ellipse(0, 0, size);
            
        } catch (e) {
            console.warn("Couldn't set explosion color:", e);
            // Fallback drawing
            p.fill(255, alpha);
            p.ellipse(0, 0, 10);
        }
        
        p.pop();
    }
}
  function drawBall(ball) {
    // Trail zeichnen
    for (let i = 0; i < ball.trail.length; i++) {
      const pos = ball.trail[i];
      const alpha = p.map(i, 0, ball.trail.length, 50, 255);
      const size = p.map(i, 0, ball.trail.length, ballRadius * 0.5, ballRadius * 1.8);
      
      p.fill(ball.color[0], ball.color[1], ball.color[2], alpha);
      p.noStroke();
      p.ellipse(pos.x, pos.y, size);
    }
    
    // Ball zeichnen
    p.push();
    p.translate(ball.bodies.position.x, ball.bodies.position.y);
    
    // Glow-Effekt für Favoriten
    if (ball.isWinner || ball.bodies.render.fillStyle === 'gold') {
      p.drawingContext.shadowBlur = 30;
      p.drawingContext.shadowColor = ball.glowColor;
    }
    
    p.fill(ball.color);
    p.noStroke();
    p.ellipse(0, 0, ballRadius * 2);
    
    // Sparkle-Effekt
    if (ball.isWinner) {
      p.fill(255, 255, 255, 200 * p.abs(p.sin(ball.sparkle)));
      p.ellipse(
        ballRadius * 0.6 * p.cos(ball.sparkle),
        ballRadius * 0.6 * p.sin(ball.sparkle),
        ballRadius * 0.5
      );
    }
    
    p.drawingContext.shadowBlur = 0;
    
    // Name
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(15);
    p.stroke(0);
    p.strokeWeight(2);
    p.fill(255);
    p.text(ball.name, 0, ballRadius + 10);
    
    p.pop();
  }

  function drawBallWithImage(ball) {
    // Trail zeichnen
    for (let i = 0; i < ball.trail.length; i++) {
      const pos = ball.trail[i];
      const alpha = p.map(i, 0, ball.trail.length, 30, 150);
      const size = p.map(i, 0, ball.trail.length, ballRadius * 0.8, ballRadius * 2.2);
      
      p.fill(ball.color[0], ball.color[1], ball.color[2], alpha);
      p.noStroke();
      p.ellipse(pos.x, pos.y, size);
    }
    
    const size = ball.isWinner ? ballRadius * 2.2 : ballRadius * 2;
    
    // Bild zeichnen
    if (photos_louaded[ball.foto_name]) {
      if (!maskedFotoCache[ball.foto_name]) {
        createMaskedImage(ball.foto_name);
      }
      
      if (maskedFotoCache[ball.foto_name]) {
        // Glow für Gewinner
        if (ball.isWinner) {
          p.drawingContext.shadowBlur = 40;
          p.drawingContext.shadowColor = p.color(255, 255, 255);
        }
        
        p.imageMode(p.CENTER);
        p.image(maskedFotoCache[ball.foto_name], ball.bodies.position.x, ball.bodies.position.y, size, size);
        
        p.drawingContext.shadowBlur = 0;
      }
    }
    
    // Name
    const textOffset = ballRadius + 15;
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(15);
    p.stroke(0);
    p.strokeWeight(2);
    p.fill(255);
    p.text(ball.name, ball.bodies.position.x, ball.bodies.position.y + textOffset);
    
    // Krone für Gewinner
    if (ball.isWinner) {
      p.push();
      p.translate(ball.bodies.position.x, ball.bodies.position.y - ballRadius - 10);
      p.fill(255, 215, 0);
      p.stroke(100, 80, 0);
      p.strokeWeight(1.5);
      
      // Einfache Krone zeichnen
      p.beginShape();
      p.vertex(-15, 0);
      p.vertex(-10, -15);
      p.vertex(0, -5);
      p.vertex(10, -15);
      p.vertex(15, 0);
      p.endShape(p.CLOSE);
      
      p.pop();
    }
  }

  function createMaskedImage(imgName) {
    const size = ballRadius * 2;
    let originalImg = photos_louaded[imgName];
    
    if (originalImg) {
      originalImg.resize(size, size);
      
      let mask = p.createGraphics(size, size);
      mask.ellipse(size / 2, size / 2, size, size);
      
      let imgCopy = originalImg.get();
      imgCopy.mask(mask.get());
      
      maskedFotoCache[imgName] = imgCopy;
    }
  }

  function drawFinishLine() {
    p.stroke(0, 255, 0);
    p.strokeWeight(4);
    
    // Glow-Effekt
    p.drawingContext.shadowBlur = 20;
    p.drawingContext.shadowColor = p.color(0, 255, 0);
    
    p.line(0, finishY, p.width, finishY);
    
    p.drawingContext.shadowBlur = 0;
    
    p.fill(0, 255, 0, 150);
    p.noStroke();
    p.textSize(30);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("FINISH LINE", p.width / 2, finishY - 30);
  }

  function checkPowerUpCollisions() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const pu = powerUps[i];
      
      if (pu.isUsed) continue;
      
      for (let ball of balls) {
        if (Collision.collides(ball.bodies, pu)) {
          pu.isUsed = true;
          World.remove(world, pu);
          
          createExplosion(pu.position.x, pu.position.y, 30);
          cameraShake = 10;
          
          Body.applyForce(ball.bodies, ball.bodies.position, {
            x: p.random(-0.02, 0.02),
            y: p.random(-0.05, -0.1)
          });
          
          break;
        }
      }
    }
  }

  function checkWinner() {
    if (gameState !== "racing") return;
    
    const w = balls.find(ball => ball.winCheck(finishY, ballRadius, winner));
    
    if (w) {
      winner = w.name;
      w.isWinner = true;
      gameState = "winner";
      
      // Spezialeffekte für Gewinner
      zoomFactor = 1.2;
      cameraShake = 15;
      createExplosion(w.bodies.position.x, w.bodies.position.y, 50);
      
      // Alle anderen Bälle verlangsamen
      balls.forEach(ball => {
        if (ball !== w) {
          Body.setVelocity(ball.bodies, {
            x: ball.bodies.velocity.x * 0.3,
            y: ball.bodies.velocity.y * 0.3
          });
        }
      });
      
      // Nach 3 Sekunden zum Ende übergehen
      setTimeout(() => {
        gameState = "ended";
        Matter.World.clear(world);
        Matter.Engine.clear(engine);
      }, 3000);
    }
  }

  function drawUI() {
    p.push();
    p.resetMatrix();
    
    // Leaderboard
    const sortedBalls = [...balls].sort((a, b) => a.bodies.position.y - b.bodies.position.y).reverse();
    
    p.fill(0, 0, 0, 150);
    p.stroke(255);
    p.strokeWeight(1);
    p.rect(10, 10, 150, 30 + sortedBalls.length * 25);
    
    p.textSize(20);
    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.text("Leaderboard:", 20, 15);
    
    p.textSize(16);
    for (let i = 0; i < sortedBalls.length; i++) {
      const ball = sortedBalls[i];
      const yPos = 40 + i * 25;
      
      if (ball.isWinner) {
        p.fill(255, 215, 0);
      } else {
        p.fill(255);
      }
      
      p.text(`${i + 1}. ${ball.name}`, 20, yPos);
    }
    
    // Timer oder Gewinner-Anzeige
    if (gameState === "winner") {
      p.fill(255, 215, 0, 200);
      p.stroke(0);
      p.strokeWeight(2);
      p.rect(p.width / 2 - 200, 50, 400, 80, 10);
      
      p.textSize(40);
      p.fill(0);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(`${winner} WINS!`, p.width / 2, 90);
      
      // Konfetti-Effekt
      if (p.frameCount % 5 === 0) {
        createExplosion(
          p.random(p.width / 2 - 150, p.width / 2 + 150),
          p.random(50, 130),
          5
        );
      }
    }
    
    p.pop();
  }
};