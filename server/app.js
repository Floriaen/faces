const config = require('config');
const random = require('random');
const seedrandom = require('seedrandom');
const { createCanvas, loadImage } = require('canvas');
const express = require('express');
const app = express();
const chroma = require('chroma-js');
const palettes = require('nice-color-palettes');
const humanSkinPalette = require('./humanSkinPalette.json');

/*
  image: image or canvas element
  inlineColor: rgb array 
  outlineColor: rgb array 
*/
function fillWithColor(image, inlineColor, outlineColor) {
  let bufferCanvas = createCanvas(image.width, image.height);
  let bufferCtx = bufferCanvas.getContext('2d');
  bufferCtx.drawImage(image, 0, 0, image.width, image.height);
  var imgData = bufferCtx.getImageData(0, 0, image.width, image.height);

  for (i = 0; i < imgData.data.length; i += 4) {
    if (imgData.data[i + 3] > 0) {
      let r = imgData.data[i];
      let g = imgData.data[i + 1];
      let b = imgData.data[i + 2];
      // calculates the luminance according * to Rec. 601 (PAL/NTSC) coefficients
      let luminance = r * 0.299 + g * 0.587 + b * 0.114;
      if (luminance < 200) {
        //console.log(luminance);
        imgData.data[i] = outlineColor[0];
        imgData.data[i + 1] = outlineColor[1];
        imgData.data[i + 2] = outlineColor[2];
        imgData.data[i + 3] = 255;
      } else {
        imgData.data[i] = inlineColor[0];
        imgData.data[i + 1] = inlineColor[1];
        imgData.data[i + 2] = inlineColor[2];
        imgData.data[i + 3] = 255;
      }
    }
  }

  bufferCtx.putImageData(imgData, 0, 0);
  return bufferCanvas;
}

app.get('/face/:name', function (req, res) {
  // setup random seed from name:
  let seed = req.params.name.toLowerCase();
  seed += seed.length.toString();
  random.use(seedrandom(seed));

  // PALETTE initialise the colors used in the image:
  let colors = {
    background: null,
    face: null,
    mouth: chroma('pink')
  };

  let palette = palettes[random.int(0, 99)];
  let bc = palette[random.int(0, 4)];
  let bf = humanSkinPalette[random.int(0, humanSkinPalette.length - 1)];
  colors.background = chroma(bc).luminance(0.09);
  colors.face = chroma(bf).luminance(0.5);
  colors.outline = colors.background.darken(1.6);

  const _size = config.get('Face.size');
  const canvas = createCanvas(_size.width, _size.height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = colors.background.hex();
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

    var coloredShape = fillWithColor(shape, colors.face.rgb(), colors.outline.rgb());
    ctx.drawImage(coloredShape, rw * w, rh * h, w, h, 0, 0, _size.width, _size.height);

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

    var coloredShape = fillWithColor(mouth, colors.mouth.rgb(), colors.outline.rgb());
    ctx.drawImage(coloredShape, rw * w, rh * h, w, h, 0, 0, _size.width, _size.height);

    return loadImage(__dirname + element.directoryPath + 'nose.png');
  })
  .then(nose => {
    let rw = random.int(0, _item.horizontalCount - 1);
    let rh = random.int(0, _item.verticalCount - 1);
    
    var coloredNose = fillWithColor(nose, colors.face.rgb(), colors.outline.rgb());
    ctx.drawImage(coloredNose, rw * w, rh * h, w, h, 0, 0, _size.width, _size.height);

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