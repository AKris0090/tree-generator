var axiom = "X";
var angle;
var originalLen = 450;
var falloff = 0.5;
var weightFalloff = 0.2;
var iterations = 8;
var len = originalLen;
var originalWeight = 2;
var newWeight = originalWeight;
var minAngle = 10;
var maxAngle = 45;
var leafColor = 0;
var sentence = axiom;
var randomNum;
var params;
var rules;
var seed;

// preset 1:
var rules1 = [];
rules1[0] = {a: "X", b: "F[+X]F[-X]+X"};
rules1[1] = {a: "F", b: "FF"};
var rules2 = [];
rules2[0] = {a: "X", b: "F[+X][-X]FX"};
rules2[1] = {a: "F", b: "FF"};
var rules3 = [];
rules3[0] = {a: "X", b: "F-[[X]+X]+F[+FX]-X"};
rules3[1] = {a: "F", b: "FF"};
var rules4 = [];
rules4[0] = {a: "X", b: "FFFFFFFFFFFFFF[-FX]+FX"};

var presets = [rules1, rules2, rules3, rules4];
var axioms = ["X", "X", "X", "FX"];
var falloffs = [0.5, 0.5, 0.5, 0.45];

function generateSentence() {
  if(!params.seed) {
    seed = random(0, 10000);
    randomSeed(seed);
  }
  newWeight = originalWeight;
  // random numbers
  angle = radians(floor(random() * (maxAngle - minAngle + 1) + minAngle));
  len = floor(random() * (originalLen - 156) + 155);
  var ruleNum = floor(random() * (4));
  rules = presets[ruleNum];
  randomNum = floor(random() * 2);
  axiom = axioms[ruleNum];
  sentence = axiom;
  let r = (random() * 255); // r is a random number between 0 - 255
  let g = (random() * 255); // g is a random number betwen 100 - 200
  let b = (random() * 255); // b is a random number between 0 - 100
  a = 200; // a is a random number between 200 - 255
  leafColor = color(r, g, b, a);
  falloff = falloffs[ruleNum];
  
  for(var k = 0; k < iterations; k++) {
    len *= falloff;
    var newSentence = "";
    for (var i = 0; i < sentence.length; i++) {
      var current = sentence.charAt(i);
      var found = false;
      for(var j = 0; j < rules.length; j++) {
        if(current == rules[j].a) {
          newSentence += rules[j].b;
          found = true;
          break;
        }
      }
      if(!found) {
        newSentence += current;
      }
    }
    sentence = newSentence;
    turtleDraw();
  }
}

function drawLeaf() {
  fill(leafColor);
  stroke(leafColor);
  var randomSize = floor(random() * (10) + 2)
  if(randomNum == 0){
    circle(0, 0, randomSize);
  } else {
    triangle(-randomSize, 0, randomSize, 0, 0, -(randomSize * 2));
  }
}

function turtleDraw() {
  background(51);
  resetMatrix();
  translate(width / 2, height);
  stroke(255);
  for(var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);
    
    if(current == "F") {
      rect(0, 0, newWeight, -(len));
      translate(0, -len);
    } else if (current == "+") {
      rotate(angle);
    } else if (current == "-") {
      rotate(-angle);
    } else if (current == "[") {
      push();
      newWeight *= weightFalloff;
    } else if (current == "]") {
      newWeight /= weightFalloff;
      drawLeaf();
      pop();
    }
  }
}

// Copy and paste this function in to your sketch:
function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function createLink() {
  let url = "http://ajnkrishnan.me/tree-generator/?seed=" + seed + "&numIterations=" + iterations;
  console.log(url);
  copyToClipboard(url);
}

let iterationSlider;

function setup() {
  params = getURLParams();
  if(params.seed) {
    seed = params.seed;
    randomSeed(seed);
    createCanvas(window.innerWidth, window.innerHeight - 25);
    background(51);
    angle = radians(25.7);
    iterations = params.numIterations;
    turtleDraw();
    generateSentence();
    return;
  }
  createCanvas(window.innerWidth, window.innerHeight - 25);
  background(51);
  angle = radians(25.7);
  turtleDraw();
  var button = createButton("generate");
  var copy = createButton("copy link");
  button.position((width) - 425, 100);
  button.mousePressed(generateSentence);
  button.size(150, 60);
  button.style('background-color: #0F0F0F; border-radius: 25%; color: white;')
  copy.position((width) - 250, 100);
  copy.mousePressed(createLink);
  copy.size(150, 60);
  copy.style('background-color: #0F0F0F; border-radius: 25%; color: white;')
  textSize(25);
  
  iterationSlider = createSlider(1, 8, 5);
  iterationSlider.position(width - 450, 50);
}


function draw() {
  stroke(0);
  fill(0);
  if(!params.seed) {
    fill(255, 248, 231);
    rect(width - 475, 25, 425, 150, 25);
    iterations = iterationSlider.value();
    text('number of iterations', iterationSlider.x + iterationSlider.width + 15, iterationSlider.height + 50);
  } else {
    text('make your own tree at: https://ajnkrishnan.me/tree-generator/', 15, 50);
  }
}
