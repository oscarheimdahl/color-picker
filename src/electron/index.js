const { app, ipcMain } = require('electron');
const buildMenuIcon = require('./menuIcon.js');
const buildCapturerWindow = require('./capturer.js');
const buildColorWindow = require('./color.js');

let color = '';
let colorWindow;
let capturerWindow;
let colorFormat = 'hex';

if (require('electron-squirrel-startup')) {
  app.quit();
}

if (process.platform === 'darwin') {
  app.dock.hide();
}

const build = () => {
  buildMenuIcon(capture, app.quit, setRGB);
};

const capture = () => {
  if (!colorWindow || colorWindow.isDestroyed()) {
    colorWindow = buildColorWindow();
    capturerWindow = buildCapturerWindow();
  }
  capturerWindow.once('ready-to-show', () => {
    capturerWindow.webContents.send('set-format', colorFormat === 'rgb');
    colorWindow.show();
    capturerWindow.show();
    capturerWindow.webContents.send('capture-screen');
  });
};

const setRGB = (rgb) => {
  if (rgb) colorFormat = 'rgb';
  else colorFormat = 'hex';
  if (capturerWindow)
    capturerWindow.webContents.send('set-format', colorFormat === 'rgb');
};

app.on('ready', build);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('select-color', () => {
  setTimeout(() => {
    capturerWindow.close();
    colorWindow.close();
  }, 300);
});

ipcMain.on('color', (event, data) => {
  if (colorWindow) colorWindow.webContents.send('color', data);
  color = data.color;
});

ipcMain.on('print', (event, data) => {
  console.log(data);
});
