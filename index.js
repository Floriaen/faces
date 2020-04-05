const { createCanvas, loadImage } = require('canvas');
const express = require('express');
const app = express();
 
app.get('/', function (req, res) {
  //res.send('Hello World')
  //res.setHeader('Content-Type', 'image/png');
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');
   
  // Write "Awesome!"
  ctx.font = '30px Impact';
  ctx.rotate(0.1);
  ctx.fillText('Awesome!', 50, 100);
   
  // Draw line under text
  var text = ctx.measureText('Awesome!');
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.lineTo(50, 102);
  ctx.lineTo(50 + text.width, 102);
  ctx.stroke();
   
  // Draw cat with lime helmet
  loadImage(__dirname + '/data/images/IMG_7626_2.jpg').then((image) => {
    ctx.drawImage(image, 50, 0, 70, 70);
    res.set('Content-Type', 'text/html');
    res.send('<img src="' + canvas.toDataURL() + '" />');
  })
    
});
app.listen(3000);