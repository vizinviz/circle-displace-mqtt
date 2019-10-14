'use strict';

var tileCount = 40;
var actRandomSeed = 0;

var circleAlpha = 130;
var circleColor;

var temperature = 0;
var easedTemperature = 0;
var tempertureLabel = "T";


function setup () {
  createCanvas(windowWidth, windowHeight);
  noFill();
  circleColor = color(0, 0, 0, circleAlpha);

  var client = mqtt.connect('mqtt://aeba5ae7:98e21bb6bccdb957@broker.shiftr.io', {
    clientId: 'vizinviz-circle-displace-mqtt'
  });
  console.log('client', client);

  client.on('connect', function () {
    console.log('client has connected!');
    client.subscribe('/temperature');
  });

  client.on('message', function(topic, message) {
    console.log('new message:', topic, message.toString());
    temperature = +message.toString();
  
  });
}



function draw () {

  push();
  translate(width / tileCount / 2, height / tileCount / 2);

  background(255);

  randomSeed(actRandomSeed);

  stroke(circleColor);
  noFill();

  easedTemperature = ease(easedTemperature, temperature);
  var temperatureScale = map(easedTemperature, 20, 30, 0, 50);
  temperatureScale = constrain(temperatureScale, 0, 100);

  textSize(350);
  textAlign(CENTER, CENTER);
  textFont('Relevant');
  noStroke();
  fill('DeepPink');
  textStyle(BOLD);
  text(round(temperature) + '\u00B0', width / 2, height / 2);

  for (var gridY = 0; gridY < tileCount; gridY++) {
    for (var gridX = 0; gridX < tileCount; gridX++) {

      var posX = width / tileCount * gridX;
      var posY = height / tileCount * gridY;


      //console.log(easedTemperature,temperature,temperatureScale);
      //console.log('temperatureSCale',temperatureScale);

      var shiftX = random(-temperatureScale, temperatureScale);
      var shiftY = random(-temperatureScale, temperatureScale);

      strokeWeight(3);
      noFill();
      stroke(0);
      // ellipse(posX + shiftX, posY + shiftY, 20, 20);
      noStroke();
      fill(0);
      // ellipse(posX,posY,3,3);
      noFill();
      stroke(0);
      strokeWeight(2);
      ellipse(posX + shiftX, posY + shiftY, 10, 10);

      stroke(0);
      strokeWeight(2);

    }
  }
  pop();

}

function mousePressed () {
  actRandomSeed = random(100000);
}

function keyReleased () {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}

function ease (n, target) {
  var easing = 0.05;
  var d = target - n;
  return n + d * easing;
}
