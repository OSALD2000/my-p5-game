import p5 from 'p5';

import sketch_1 from './sketch1/sketch_1';
import sketch_2 from './sketch2/sketch_2';
import sketch_3 from './sketch3/sketch_3';
import sketch_4 from './sketch4/sketch_4';
import sketch_5 from './sketch5/sketch_5';
import sketch_6 from './sketch6/sketch_6';

let p5Instance = null;

function startSketch() {
  //const anzahl = parseInt(document.getElementById('anzahl').value) || 80;

//  if (p5Instance) {
  //  p5Instance.remove();
  //}

  p5Instance = new p5((p) => sketch_1(p, {  }));
}

//document.getElementById('anzahl').addEventListener('change', startSketch);

startSketch();