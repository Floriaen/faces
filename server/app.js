const config = require('config');
const random = require('random');
const seedrandom = require('seedrandom');
const { createCanvas, loadImage } = require('canvas');
const express = require('express');
const app = express();

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/random/:name', function (req, res) {
  // setup random seed from name:
  let seed = req.params.name.toLowerCase();
  seed += seed.length.toString();
  random.use(seedrandom(seed));

  let _size = config.get('Face.size');
  const canvas = createCanvas(_size.width, _size.height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFF';
  ctx.fillRect(0, 0, _size.width, _size.height);

  let _item = config.get('Face.item');
  let w = _item.size.width;
  let h = _item.size.height;

  // get the resources and shuffle
  let _elements = config.get('Face.elements');
  elements = createRandomArrayFromElements(_item.kindCount, _elements);

  loadImage(__dirname + elements[0].directoryPath + 'shape.png')
  .then(shape => {
    let element = elements[1];
    let rw = random.int(0, _item.horizontalCount - 1);
    let rh = random.int(0, _item.verticalCount - 1);
    ctx.drawImage(shape, rw * w, rh * h, w, h, 0, 0, _size.width, _size.height);
    
    return loadImage(__dirname + element.directoryPath + 'eyes.png');
  })
  .then(eyes => {
    let element = elements[2];
    let rw = random.int(0, _item.horizontalCount - 1);
    let rh = random.int(0, _item.verticalCount - 1);
    ctx.drawImage(eyes, rw * w, rh * h, w, h, 0, 0, _size.width, _size.height);

    return loadImage(__dirname + element.directoryPath + 'mouth.png');
  })
  .then(mouth => {
    let element = elements[3];
    let rw = random.int(0, _item.horizontalCount - 1);
    let rh = random.int(0, _item.verticalCount - 1);
    ctx.drawImage(mouth, rw * w, rh * h, w, h, 0, 0, _size.width, _size.height);

    return loadImage(__dirname + element.directoryPath + 'nose.png');
  })
  .then(nose => {
    let rw = random.int(0, _item.horizontalCount - 1);
    let rh = random.int(0, _item.verticalCount - 1);
    ctx.drawImage(nose, rw * w, rh * h, w, h, 0, 0, _size.width, _size.height);

    res.set('Content-Type', 'image/png');
    res.send(canvas.toBuffer());
  }).catch(function(e) {
    console.log(e);
  });

});
app.listen(3000);

function createRandomArrayFromElements(arrayLength, elements) {
  var newElements = new Array(arrayLength);
  for (let i = 0; i < arrayLength; i++) {
    newElements[i] = (elements[random.int(0, elements.length - 1)]);
  }
  return newElements;
}