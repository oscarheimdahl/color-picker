const { BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let color = null;

const buildColor = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  color = new BrowserWindow({
    width: width,
    height: height,
    skipTaskbar: true,
    backgroundColor: '#00ffffff',
    transparent: true,
    titleBarStyle: 'hidden',
    frame: false,
    resizable: false,
    focusable: false,
    hasShadow: false,
    show: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //   color.on('blur', () => color.hide());
  color.setIgnoreMouseEvents(true);
  color.loadFile(path.join(__dirname, '../render/color/color.html'));
  return color;
};

module.exports = buildColor;
