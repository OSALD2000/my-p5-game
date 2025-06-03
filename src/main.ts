import { Engine, Render, Bodies, World, Runner } from "matter-js";

var engine = Engine.create();

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
});


// Zwei Körper erstellen
const boxA = Bodies.rectangle(400, 200, 80, 80, {});
const ground = Bodies.rectangle(400, 580, 810, 60, { isStatic: true });

// Zur Welt hinzufügen
World.add(engine.world, [boxA, ground]);

Render.run(render);

var runner = Runner.create();

// Engine starten
Runner.run(runner, engine);