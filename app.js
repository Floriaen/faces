const { createCanvas, loadImage } = require('canvas');
const express = require('express');
Math.seedrandom = require('seedrandom');
const app = express();


const FANNY_FACES = '/data/images/faces-fanny/';
const FLORIAN_FACES = '/data/images/faces-florian/';
const MARGAUX_FACES = '/data/images/faces-margaux/';

const FACES_X = 3;
const FACES_Y = 4;

const FACES_PATH = MARGAUX_FACES;
 
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/random/:name', function (req, res) {
  var seed = req.params.name.toLowerCase();
  seed += seed.length.toString();
  Math.seedrandom(seed);

  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
   
  let facesRelativePath = __dirname + FACES_PATH;
  // Draw cat with lime helmet
  loadImage(facesRelativePath + 'eyes.png').then((eyes) => {
    loadImage(facesRelativePath + 'mouth.png').then((mouth) => {
      loadImage(facesRelativePath + 'nose.png').then((nose) => {
        loadImage(facesRelativePath + 'shape.png').then((shape) => {
          let w = 800;
          let h = 800;

          // face shape
          let w1 = Math.floor(Math.random() * FACES_X);
          let h1 = Math.floor(Math.random() * FACES_Y);
          ctx.drawImage(shape, w1 * w, h1 * h, w, h, 0, 0, 512, 512);
          
          // eyes
          let w2 = Math.floor(Math.random() * FACES_X);
          let h2 = Math.floor(Math.random() * FACES_Y);
          ctx.drawImage(eyes, w2 * w, h2 * h, w, h, 0, 0, 512, 512);

          // mouth
          let w3 = Math.floor(Math.random() * FACES_X);
          let h3 = Math.floor(Math.random() * FACES_Y);
          ctx.drawImage(mouth, w3 * w, h3 * h, w, h, 0, 0, 512, 512);
  
          // noise
          let w4 = Math.floor(Math.random() * FACES_X);
          let h4 = Math.floor(Math.random() * FACES_Y);
          ctx.drawImage(nose, w4 * w, h4 * h, w, h, 0, 0, 512, 512);
  
          res.set('Content-Type', 'image/png');
          res.send(canvas.toBuffer());
        })
      })
    })
  })
    
});
app.listen(3000);

function drawFaces() {

}