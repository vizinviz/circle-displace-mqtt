// P_2_1_2_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * changing size and position of circles in a grid
 *
 * MOUSE
 * position x          : circle position
 * position y          : circle size
 * left click          : random position
 *
 * KEYS
 * s                   : save png
 */
'use strict';

var tileCount = 40;
var actRandomSeed = 0;

var circleAlpha = 130;
var circleColor;

var temperature = 0;
var easedTemperature = 0;
var tempertureLabel = "T";

// Declare a "SerialPort" object
//let serial;
// fill in the name of your serial port here:
let portName = "/dev/tty.usbmodem1411";

function setup () {
  createCanvas(windowWidth, windowHeight);
  noFill();
  circleColor = color(0, 0, 0, circleAlpha);

  // make an instance of the SerialPort object
  //serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results. See gotList, below:
  //serial.list();

  // Assuming our Arduino is connected,  open the connection to it
  //serial.open(portName);

  // When you get a list of serial ports that are available
  //serial.on('list', gotList);

  // When you some data from the serial port
  //serial.on('data', gotData);

  var client = mqtt.connect('mqtt://ac4b9437:253599623a0a0034@broker.shiftr.io', {
    clientId: 'vizinviz-circle-displace-mqtt'
  });
  console.log('client', client);

  client.on('connect', function () {
    console.log('client has connected!');

    client.subscribe('/temperature');
    // client.unsubscribe('/example');
  });

  client.on('message', function(topic, message) {
    console.log('new message:', topic, message.toString());
    temperature = +message.toString();
    //console.log(message);
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
      // line(posX,posY,posX + shiftX, posY + shiftY);

      // if(temperatureScale<2){
      //   ellipse(posX,posY,4,4);
      // }
    }
  }
  pop();

  // fill(255);
  // noStroke();
  // rect(0, 0, 90, 30);

  // fill(0);
  // noStroke();
  // textSize(16);
  // textAlign(LEFT,CENTER);
  // text(tempertureLabel + ': ' + temperature,10,15);

}

function mousePressed () {
  actRandomSeed = random(100000);
}

function keyReleased () {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}


// Got the list of ports
// function gotList (thelist) {
//   print("List of Serial Ports:");
//   // theList is an array of their names
//   for (let i = 0; i < thelist.length; i++) {
//     // Display in the console
//     print(i + " " + thelist[i]);
//   }
// }

// Called when there is data available from the serial port
// function gotData () {
//   let currentString = serial.readLine();  // read the incoming data
//   trim(currentString);                    // trim off trailing whitespace
//   if (!currentString) return;             // if the incoming string is empty, do no more
//   console.log(currentString);
//   if (!isNaN(currentString)) {  // make sure the string is a number (i.e. NOT Not a Number (NaN))
//     temperature = +currentString;   // save the currentString to use for the text position in draw()
//   }
//   else {
//     console.log('we have nan: ' + currentString);
//   }
// }

function ease (n, target) {
  var easing = 0.05;
  var d = target - n;
  return n + d * easing;
}
