

export default (p, options = {}) => {
    const cols = 16;
    const rows = 19;
    const numberSize = 25;
    const hiddenValue = "📫";
    const defaultValue = "📬";
    const cellWidth = 35;
    const cellHeight = 35;
    
    let countdown = 30;
    let lastSecond = 0;
  
    let hiddenCol, hiddenRow;

    const rotations = [];
    let topColor, bottomColor;

    p.setup = () => {
      p.createCanvas(600, 900);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(numberSize);
      lastSecond = p.millis();
      hiddenCol = p.floor(p.random(cols));
      hiddenRow = p.floor(p.random(rows));
      
      topColor = p.color(p.random(200, 255), p.random(200, 255), p.random(200, 255));
      bottomColor = p.color(p.random(200, 255), p.random(200, 255), p.random(200, 255));
      

      for (let r = 0; r < rows; r++) {
        rotations[r] = [];
        for (let c = 0; c < cols; c++) {
          rotations[r][c] = p.random(-p.PI / 3, p.PI / 3);
        }
      }

    };
  
    p.draw = () => {
      drawGradientBackground();


      if (p.millis() - lastSecond > 1000 && countdown > 0) {
        countdown--;
        lastSecond = p.millis();
      }

      p.textSize(32);
      p.fill(200, 0, 0);
      p.text(`Find the ${hiddenValue}`, p.width / 2, 100);

      p.fill(0);
      p.textSize(40);
      p.text(`Time: ${countdown}`, p.width / 2, 60);
  
      const gridWidth = cols * cellWidth;
      const gridHeight = rows * cellHeight;
      const offsetX = (p.width - gridWidth) / 2;
      const offsetY = 200;
      
      p.textSize(numberSize);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const value = (r === hiddenRow && c === hiddenCol) ? hiddenValue : defaultValue;
        const x = offsetX + c * cellWidth + cellWidth / 2;
        const y = offsetY + r * cellHeight + cellHeight / 2;
        const angle = rotations[r][c];

        p.push();
        p.translate(x, y);
        p.rotate(angle);
        p.text(value, 0, 0);
        p.pop();
      }
    }
    };


    function drawGradientBackground() {
        for (let y = 0; y < p.height; y++) {
          let inter = p.map(y, 0, p.height, 0, 1);
          let c = p.lerpColor(topColor, bottomColor, inter);
          p.stroke(c);
          p.line(0, y, p.width, y);
        }
      }
  };
  