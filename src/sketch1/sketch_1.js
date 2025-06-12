import Matter from "matter-js";


const funnyComments = [
  "سلمان\n المسلوق",             
  "طحكوت\n الكتكوت",              // The connection joker
  "حمود\n مسكر",                 // Hammoud the drunk
  "برغريتا",                   // Wordplay or nickname, likely humorous
  "قويدر\n الرفيس",             // Kuwider of Rafis (could be slang or nickname)
  "ريمان\n المقدردة",           // Raiman the ruined
  "الرول \nلبيع البيتبول",       // States selling pitbulls (nonsense/sarcastic)
  "كرّكم\n الغضب 🔥",            // Anger has devoured you
  "غذنفر\n البيضاوي",           // Ghadanfar the Whiteawi (nickname)
  "أبو \nستمشة",                // Abu Sutmsha (made-up/funny name)
  "بنزينا\n الزعلوك", // I wished Zaalouk Gasoline won 😂
  "بركات\n كولا ",   // I wanted Barakat Cola to win
  "وييكهام\n المنسف",           // Wykham of the Mansaf (nonsense/funny)
];

const funny_arabic_names = [
  "سعيد\nالملوخية", "أبو\nفلافل السريع", "كريم\nالبيضاني", "حسن\nالمعكرونة", "خليل\nأبو شعرة",
  "فادي\nالكوسا", "سامي\nأبو شاورما", "جلال\nالرز المقلي", "مازن\nالبامية", "رامي\nكفتة النمر",
  "نيمار\nالزعتر", "ليفاندوكي\nالفلافل", "ميسي\nالكنافة", "محمد\nصلصة", "بنزيما\nالزعلوك",
  "هالاند\nالمشاوي", "بيكهام\nالمنسف", "رونالدو\nالشاورما", "زيدان\nالطرشي", "مبابي\nالفول",
  "أبو\nجرجير", "شيخ\nالفاصوليا", "داهش\nأبو بندورة", "علي\nسطل اللبن", "أبو\nقحط العجيب",
  "سلطان\nالطحينية", "هاني\nخروف البر", "تركي\nالجزراني", "حمود\nأبو علبة", "ماجد\nبيضة مسلوقة",
  "يوسف\nالفطيرة", "تيمور\nالكبسة", "عامر\nالعلكة", "جابر\nالبقسماط", "هيثم\nطحينية",
  "أشرف\nالكبابجي", "طلال\nبيتزاية", "نديم\nعصيدة", "هشام\nكشري", "عامر\nالحمصي",
  "برقوق\nالباذنجان", "كركم\nالغضب", "عزيز\nريشة", "راكان\nالمقلي", "قاسم\nالعكر",
  "مخلل\nالجبل", "سوسو\nالبصلي", "همام\nالحار", "رائد\nالكبريت", "جرجير\nالمجنون",
  "أبو\nنص كم", "شحاطة\nالنمر", "أبو\nشنب الناعم", "برقوق\nالكهف", "بطيخ\nاللوزي",
  "أبو\nقرن الشاي", "نعيم\nالفسفوري", "رامي\nزيتون", "سفيان\nالبطاطسي", "بركات\nكولا"
]


const slykhStyleNames = [
  "سليخ",
  "سلاليخ",
  "سلويخ",
  "سليلوخ",
  "ساليخ",
  "سليلوخي",
  "سولخ",
  "سللوخ",
  "سولاليخ",
  "سولليخ",
  "سليخوخ",
  "سلييخ",
  "سليخي",
  "سلاخيل",
  "سلايخ",
  "سليخول",
  "سولليخي",
  "سلالوخ",
  "سوليخ",
  "سلخولي"
];

const maskedFotoCache = {};
const photos_louaded = {}


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

const monkys_array = [
  {
    name: "القرد\nأبو كاب أزرق",
    foto: "monkey_10.jpg"
  },
  {
    name: "القرد\nسنانير",
    foto: "monkey_9.jpg"
  },
  {
    name: "القرد\nأبو ضحكة جنان",
    foto: "monkey_8.jpg"
  },
  {
    name: "القرد\nشارب باشا",
    foto: "monkey_7.jpg"
  },
  {
    name: "القرد\nالفاضي",
    foto: "monkey_6.jpg"
  },
  {
    name: "القرد\nالمتشيك",
    foto: "monkey_5.jpg"
  },
  {
    name: "القرد\nأبو فروة منكوشة",
    foto: "monkey_4.jpg"
  },
  {
    name: "القرد\nمغني الراب",
    foto: "monkey_3.jpg"
  },
  {
    name: "القرد\nأبو دقن",
    foto: "monkey_2.jpg"
  },
  {
    name: "القرد\nأبو عيون كبار",
    foto: "monkey_1.jpg"
  }
]


function generateFunnyArabicNames(n) {
  const firstParts = [
    "أبو", "شيخ", "معلم", "سلطان", "كابتن", "دكتور", "باشا", "زعيم", "أستاذ", "الحاج",
    "سعيد", "كريم", "مازن", "رائد", "فادي", "هشام", "نديم", "سامي", "طلال", "أشرف",
    "رامي", "جلال", "تركي", "عامر", "هاني", "برقوق", "سوسو", "جرجير", "مخلل", "بنزيما",
    "ميسي", "نيمار", "رونالدو", "زيدان", "مبابي", "هالاند", "بيكهام", "ليفاندوكي", "محمد", "علي"
  ];

  const secondParts = [
    "الملوخية", "الفلافل", "الحمص", "الكشري", "الكنافة", "الشاورما", "الرز المقلي", "الزعلوك",
    "المشاوي", "المنسف", "الطرشي", "البامية", "الكوسا", "الفطيرة", "الكبسة", "العلكة",
    "طحينية", "الكبابجي", "بيتزاية", "عصيدة", "الحمصي", "الباذنجان", "الغضب", "ريشة",
    "المقلي", "العكر", "الجبل", "البصلي", "الحار", "الكبريت", "المجنون", "نص كم",
    "النمر", "شنب الناعم", "الكهف", "اللوزي", "قرن الشاي", "الفسفوري", "زيتون", "البطاطسي", "كولا", "البيضاني"
  ];

  const names = [];
  for (let i = 0; i < n; i++) {
    const first = firstParts[Math.floor(Math.random() * firstParts.length)];
    const second = secondParts[Math.floor(Math.random() * secondParts.length)];
    names.push(`${first}\n${second}`);
  }
  return names;
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateFunnyArabicNames2(n)
{
    let shuffled = shuffleArray(funny_arabic_names);

    let picked = shuffled.slice(0, n);

    return picked;
}




export default (p, options = {}) => {
  const Engine = Matter.Engine;
  const World = Matter.World;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;

  var Ball = function(bodies, color, name, velocity_vector = { x: p.random(-5, 5), y: p.random(-5, 5) }, with_foto = false, foto_name) {
      this.bodies = bodies;
      this.color = color;
      this.name = name;
      this.with_foto = with_foto;
      this.foto_name = foto_name;
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

  const ballRadius = 23;

  p.setup = () => {
    p.createCanvas(canvasWidth, canvasHeight);
    engine = Engine.create();
    world = engine.world;
    engine.gravity.y = 0.8;


    const wallThickness = 50;
    const bounds = [
      Bodies.rectangle(200, -wallThickness / 2, canvasWidth, wallThickness, { isStatic: true }),
      Bodies.rectangle(200, 6000 + wallThickness / 2, canvasWidth, wallThickness, { isStatic: true }),
      Bodies.rectangle(-wallThickness / 2, 3000, wallThickness, 6000, { isStatic: true }),
      Bodies.rectangle(canvasWidth + wallThickness / 2, 3000, wallThickness, 6000, { isStatic: true }),
    ];
    World.add(world, bounds);

    //createBalls(["محمد \n كرعة", "غابريل", "وليام", "كيرن", "نايف","خالد \n خريطة", "كرستيان  \nشالر", "ليفاندوسكي\n الاحمر", "يورغي"], "محمد \n كرعة");
    //createBalls(generateFunnyArabicNames(2));
    //createBalls(["علي\n خريطة", "يارا\n خريطة", "ظافر \nخريطة", "رشا \nخريطة"]);
    //createBalls(generateFunnyArabicNames2(20))
    //createBalls(shuffleArray(slykhStyleNames))

    //createBallsWithFoto(shuffleArray(monkys_array).slice(0, 3))
    // monkys_array.forEach(item => p.loadImage(`/pictures/${item["foto"]}`, (loadedImg) => {
    //   photos_louaded[item["foto"]] = loadedImg;
    // }))    

    createBallsWithFoto(shuffleArray(alrahma_array))
    alrahma_array.forEach(item => p.loadImage(`/pictures/${item["foto"]}`, (loadedImg) => {
      photos_louaded[item["foto"]] = loadedImg;
    }))    

    generateObstacles();
    
    balls.forEach(ball => World.add(world, ball.bodies))

  };

  function createBalls(names, favored)
  {
      names.forEach((n, i) =>{
        const isFavored = n.includes(favored);
        balls.push(new Ball(
          Bodies.circle(250 + p.random(-100, 100), 50 + i * 5, ballRadius, { restitution: isFavored ? 0.5 : 0.7, friction: isFavored ? 0.001 : 0.001, frictionAir: isFavored ? 0.00001 : 0.00001 }),
          getRandomColor(),
          n,
          isFavored 
          ? { x: p.random(-5, 10), y: p.random(5, 10) }
          : { x: p.random(-5, 5), y: p.random(-5, 5) }
        ));
      })
    }

    function createBallsWithFoto(names, favored)
    {
        names.forEach((n, i) =>{
          const isFavored = n["name"].includes(favored);
          balls.push(new Ball(
            Bodies.circle(250 + p.random(-100, 100), 
            50 + i * 5,
             ballRadius,
              { restitution: isFavored ? 0.5 : 0.65, friction: isFavored ? 0.001 : 0.018, frictionAir: isFavored ? 0.00001 : 0.00001 }),
            getRandomColor(),
            n["name"],
            isFavored 
            ? { x: p.random(-5, 10), y: p.random(5, 10) }
            : { x: p.random(-5, 5), y: p.random(-5, 5) },
            true,
            n["foto"]
          ));
        })
    }

  function generateObstacles() {
    for (let i = 1; i < 22; i++) {
      const y = i * 230;
      const angle = p.random(0.3, 0.4);
      const gapWidth = 40;
      const totalWidth = canvasWidth;
      const gapX = p.random(20, 400 - gapWidth);

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

    balls.forEach(ball => ball.with_foto ? drawBallWithImage(ball.bodies, ball.foto_name, ball.name) : drawBall(ball.bodies, ball.color, ball.name))

    const finishY = 5100;
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


  function drawBallWithImage(ball, imgName, name) {
    const size = ballRadius * 2;
  
    if (!maskedFotoCache[imgName] && photos_louaded[imgName]) {
      let originalImg = photos_louaded[imgName];
      originalImg.resize(size, size);
      
      let mask = p.createGraphics(size, size);
      mask.ellipse(size / 2, size / 2, size, size);
  
      let imgCopy = originalImg.get();
      imgCopy.mask(mask);
      
      maskedFotoCache[imgName] = imgCopy;
    }
  
    if (maskedFotoCache[imgName]) {
      p.imageMode(p.CENTER);
      p.image(maskedFotoCache[imgName], ball.position.x, ball.position.y);
    }
  
    const textOffset = ballRadius + 10;
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(15);
    p.stroke(0);
    p.strokeWeight(3);
    p.fill(255);
    p.text(name, ball.position.x, ball.position.y + textOffset);
  }
};