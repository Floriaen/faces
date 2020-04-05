const { createCanvas, loadImage } = require('canvas');
const express = require('express');
const app = express();
 
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/random.png', function (req, res) {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
   
  // Draw cat with lime helmet
  loadImage(__dirname + '/data/images/eyes-and-mouth.png').then((eyesAndMouth) => {
    loadImage(__dirname + '/data/images/shape.png').then((shape) => {

      let w = 800;
      let h = 800;

      // face shape
      let w1 = Math.floor(Math.random() * 3);
      let h1 = Math.floor(Math.random() * 2);
      ctx.drawImage(shape, w1 * w, h1 * h, w, h, 0, 0, 512, 512);
      
      // face eyes and mouth
      let w2 = Math.floor(Math.random() * 3);
      let h2 = Math.floor(Math.random() * 2);
      ctx.drawImage(eyesAndMouth, w2 * w, h2 * h, w, h, 0, 0, 512, 512);

      //res.set('Content-Type', 'text/html');
      //res.send('<img src="' + canvas.toDataURL() + '" />');
      
      res.set('Content-Type', 'image/png');
      //res.send(new Buffer(buffer, 'binary'))
      res.send(canvas.toBuffer());
      
    })
  })
    
});
app.listen(3000);

function drawFaces() {

}