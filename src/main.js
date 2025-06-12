import p5 from 'p5';

import sketch_1 from './sketch1/sketch_1';
import sketch_2 from './sketch2/sketch_2';
import sketch_3 from './sketch3/sketch_3';
import sketch_4 from './sketch4/sketch_4';
import sketch_5 from './sketch5/sketch_5';
import sketch_6 from './sketch6/sketch_6';
import sketch_7 from './sketch7/sketch_7';
import sketch_8 from './sketch8/sketch_8';
import sketch_9 from './sketch9/sketch_9';
import sketch_10 from './sketch10/sketch_10';
import sketch_11 from './sketch11/sketch_11';
import sketch_12 from './sketch12/sketch_12';

let p5Instance = null;

function startSketch() {
  //const anzahl = parseInt(document.getElementById('anzahl').value) || 80;

  //  if (p5Instance) {
  //  p5Instance.remove();
  //}

  p5Instance = new p5((p) => sketch_12(p, {  }));
}

//document.getElementById('anzahl').addEventListener('change', startSketch);

startSketch();