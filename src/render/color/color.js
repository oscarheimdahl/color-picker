const { ipcRenderer } = require('electron');

ipcRenderer.on('color', (event, data) => {
  document.getElementById('color').style.borderColor = data.color;
  document.getElementById('color').style.left = data.mousePos.x + 'px';
  document.getElementById('color').style.top = data.mousePos.y + 'px';
});
