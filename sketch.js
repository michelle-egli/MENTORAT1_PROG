//pictures
let player;
let enemieImages;
let city;
let mode0;
let mode1;
let mode2;
let mode4;
let mode5;


//parameter
let bg;
let bgX = 0; //where to start the background, x parameter
let enemies = [];
let posx = 150; //player
let posy = 300; //player
let up = 2; //keyIsPressed W
let down = 2; //keyIsPressed S
let h = 106; //enemie höhe
let w = 37; //enemie breite
let c = 20; //bounding box correction
let mode; //current game mode
let bbX = 50; //bounding box x, collision detection
let bbY = 60; //bounding box y, collision detection
let difficulty; //anzahl enemie spawn -> kleinere Zahle = mehr Gegner
let slider; //difficulty slider


function preload() {
  player = [
    loadImage('sprite1.png'),
    loadImage('sprite2.png'),
    loadImage('sprite3.png'),
    loadImage('sprite4.png'),
    loadImage('sprite5.png'),
    loadImage('sprite6.png'),
    loadImage('sprite7.png')
  ];

  enemieImages = [
    loadImage('enemie_1.png'),
    loadImage('enemie_2.png'),
    loadImage('enemie_3.png'),
    loadImage('enemie_4.png'),
    loadImage('enemie_5.png'),
    loadImage('enemie_6.png'),
    loadImage('enemie_7.png'),
    loadImage('enemie_8.png'),
    loadImage('enemie_9.png'),
    loadImage('enemie_10.png'),
    loadImage('enemie_11.png'),
    loadImage('enemie_12.png'),
    loadImage('enemie_13.png'),
    loadImage('enemie_14.png'),
    loadImage('enemie_15.png'),
  ];

  city = loadImage('background.png');

  mode0 = loadImage('mode0.png');
  mode1 = loadImage('mode1.png');
  mode2 = loadImage('mode2.png');
  mode4 = loadImage('mode4.png');
  mode5 = loadImage('mode5.png');
}

function setup() {
  slider = createSlider(10, 400, 100); 
  slider.style('width', '180px'); 
  mode = 0; //initialy the game has not started
  createCanvas(800, 500);
  bg = createGraphics(4500, 500); // Erzeugt einen zweiten Canvas im ersten
  drawBackground();
}

function enemieSpawn() {
  let spawnTop = random() < 0.5;
  let y = 360; //spawn top or bottom 
  let yspeed = random(-2, 0);
  if (spawnTop) {
    y = 190;
    yspeed = random(0, 3);
  }

  enemies.push({
    x: random(0, 800),
    y: y,
    bbX: w,
    bbY: h - c,
    xspeed: random(-3, 3),
    yspeed: yspeed,
    inf: random() < 0.5,
    spriteId: 0
  });
}

function resetGame() {
  bgX = 0;
  enemies = [];
  difficulty = slider.value();
  slider.hide();
}

function draw() {
  clear();
  if (mode == 0) { //start screen
    slider.position(308, 253);
    image(mode0, 0, 0, 800, 500);
  }

  if (mode == 1) { //story
    slider.hide();
    image(mode1, 0, 0, 800, 500);
  }

  if (mode == 2) { //game function
    image(mode2, 0, 0, 800, 500);
    difficulty = slider.value();
  }

  if (mode == 3) { //start game
    image(bg, bgX, 0, 5000, 500);
    bgX--;

    //player
    let spriteIndex = floor(-bgX / 4) % 7; //animation sprites
    image(player[spriteIndex], posx, posy, 100, 100);
    if (keyIsPressed && key == 'w') { //player movement
      if (posy > 145) {
        posy -= up;
      }
    } else if (keyIsPressed && key == 's') {
      if (posy < 350) {
        posy += down;
      }
    }

    //enemieSpawn function 
    if (bgX % difficulty === 0) { //enemie spawn anzahl, kleinere Zahl = mehr enemies
      enemieSpawn();
    }

    //enemies
    for (let i = 0; i < enemies.length; i++) {
      let e = enemies[i];

      //move
      e.x += e.xspeed;
      e.y += e.yspeed;

      //despawn at housefronts
      if (e.y < 190 || e.y > 360) {
        enemies.splice(i, 1); //splice löscht das Element an der Position i aus dem Array
        i--; //array wird kürzer, deshalb muss i angepasst werden
        continue; //springt zurück zum begin des loops
      }

      //despawn at end
      if (e.x - e.bbX - 180 > 3250 + bgX) {
        enemies.splice(i, 1);
        i--;
        continue;
      }

      //draw enemie
      image(enemieImages[floor(e.spriteId / 6)], e.x, e.y, w, h);//Animation der Enemies
      e.spriteId = (e.spriteId + 1) % 90; //6x15 = 90, jedes Bild wird für 6 Ticks angezeigt

      //collision detection 
      //center player
      let pcenterX = posx + (bbX / 2); 
      let pcenterY = posy + (bbY / 2); 

      //center enemies
      let ecenterX = e.x + (e.bbX / 2);
      let ecenterY = e.y + (e.bbY / 2);

      let dX = abs(pcenterX - ecenterX); //dX = delta X, Unterschied, wobei es nie negativ wird
      let dY = abs(pcenterY - ecenterY);

      //schaut ob Player und Enemies zu nahe sind oder nicht
      if (dX <= bbX / 2 + e.bbX / 2 && dY <= bbY / 2 + e.bbY / 2) { 
        if (e.inf) { //wenn infiziert...
          mode = 5;
        } else { //wenn nicht infiziert..
          textSize(100);
          textStyle(BOLD);
          text('close call!', 200, 200); //anzeige bei Kollision mit negativem Gegner
        }
      }
    }
  }

  //end screen
  if (bgX <= -3250) {
    mode = 4;
  }

  if (mode == 4) { //end screen "you did it!"
    slider.position(308, 247);
    slider.show();
    image(mode4, 0, 0, 800, 500);
  }

  if (mode == 5) { //game over "you're infected!"
    slider.position(308, 242);
    slider.show();
    image(mode5, 0, 0, 800, 500);
  }
}


function keyPressed() {
  if (keyCode === ENTER) { //damit mit ENTER die modes gewechselt werden können
    if (mode == 4 || mode == 5) {
      resetGame();
      mode = 3;
    } else {
      mode = min(mode + 1, 3);
    }
  }
}

function drawBackground() {
  
  //city background made in adobe illustrator
  bg.image(city, 0, 0, 4000, 650);


  /*
  //street stones, in neuem Sketch ausgeführt und als png gespeichert: https://editor.p5js.org/miphira/sketches/eJ4bgHkVCy
  
  bg.noStroke();
  for (let i = 0; i < bg.width; i += 10) {
    for (let j = 0; j < bg.height; j += 12) {
      bg.rect(i, j, 8, 10, 2);
      bg.fill(random(130, 150), 80);
    }
  }
  */
}