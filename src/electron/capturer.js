const { BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

let capturer = null;

const buildCapturer = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  capturer = new BrowserWindow({
    width: width,
    height: height,
    opacity: 0,
    skipTaskbar: true,
    frame: false,
    titleBarStyle: 'hidden',
    show: false,
    focusable: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  capturer.loadFile(path.join(__dirname, '../render/capture/capture.html'));
  return capturer;
};

module.exports = buildCapturer;
