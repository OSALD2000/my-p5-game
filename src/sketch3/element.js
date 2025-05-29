import Matter from "matter-js";

class Element {
    constructor(x, y, type, world, p) {
      this.type = type; 
      this.world = world;
      this.p = p;
      this.body = Matter.Bodies.circle(x, y, 20, {
        restitution: 1,
        friction: 0,
        frictionAir:0
      });
      Matter.Body.setVelocity(this.body, { x: p.random(-20, 20), y: p.random(-5, 5) });
      Matter.World.add(this.world, this.body);
    }
  
    draw() {
      let pos = this.body.position;
      this.p.fill(this.getColor());
      this.p.ellipse(pos.x, pos.y, 40);
      this.p.textSize(20);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.text(this.getEmoji(), pos.x, pos.y);
    }
  
    getColor() {
      return {
        fire: 'red',
        water: 'blue',
        plant: 'green',
        rock: 'gray'
      }[this.type];
    }
  
    getEmoji() {
      return {
        fire: '🔥',
        water: '💧',
        plant: '🌿',
        rock: '🪨'
      }[this.type];
    }
}

export default Element;