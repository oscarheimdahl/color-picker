const {
  ipcRenderer,
  desktopCapturer,
  remote,
  nativeImage,
} = require('electron');

const plopp = new Audio('plopp.m4a');
plopp.volume = 0.3;
const { screen } = remote;

let screenShotSize = null;
let bitmap = null;
let color = '';
let rgb = false;

document.addEventListener('mousemove', () => {
  if (bitmap) getPixelColor();
});

document.addEventListener('click', () => {
  ipcRenderer.send('select-color');
  let colorString = rgb
    ? `rgb(${color.r}, ${color.g}, ${color.b})`
    : rgbToHex(color.r, color.g, color.b);
  navigator.clipboard.writeText(colorString);
  plopp.play();
});

const rgbToHex = (r, g, b) => {
  const componentToHex = (c) => {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  };
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const getPixelColor = () => {
  const mousePos = screen.getCursorScreenPoint();
  const mappedX = mousePos.x * window.devicePixelRatio;
  const mappedY = mousePos.y * window.devicePixelRatio;
  const index = (mappedX + mappedY * screenShotSize.width) * 4;
  const b = bitmap[index] - 1;
  const g = bitmap[index + 1] + 1;
  const r = bitmap[index + 2];
  const a = bitmap[index + 3];
  color = { r, g, b };
  ipcRenderer.send('color', {
    color: `rgb(${color.r},${color.g},${color.b})`,
    mousePos,
  });
};

function fullscreenScreenshot(callback) {
  this.callback = callback;
  desktopCapturer
    .getSources({ types: ['window', 'screen'] })
    .then(async (sources) => {
      for (const source of sources) {
        // Filter: main screen
        if (
          source.name === 'Entire Screen' ||
          source.name === 'Screen 1' ||
          source.name === 'Screen 2'
        ) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: source.id,
                  maxWidth: 4000,
                  maxHeight: 4000,
                },
              },
            });
            handleStream(stream, callback);
          } catch (err) {
            console.log(err);
          }
        }
      }
    });
}

const handleStream = (stream) => {
  var video = document.createElement('video');
  video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';

  video.onloadedmetadata = function () {
    video.style.height = this.videoHeight + 'px'; // videoHeight
    video.style.width = this.videoWidth + 'px'; // videoWidth

    video.play();

    var canvas = document.createElement('canvas');
    canvas.width = this.videoWidth;
    canvas.height = this.videoHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    var image = new Image('image/webp', 1.0);

    image.src = canvas.toDataURL();
    document.body.appendChild(image);
    const img = nativeImage.createFromDataURL(image.src);
    bitmap = img.toBitmap();
    screenShotSize = img.getSize();
    video.remove();
    try {
      stream.getTracks()[0].stop();
    } catch (e) {}
  };
  video.srcObject = stream;
  document.body.appendChild(video);
};

ipcRenderer.on('capture-screen', () => {
  fullscreenScreenshot();
});

ipcRenderer.on('set-format', (_, data) => {
  rgb = data;
});
