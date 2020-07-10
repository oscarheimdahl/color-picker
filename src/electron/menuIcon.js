const { Tray, nativeTheme, Menu, MenuItem } = require('electron');
const path = require('path');
const lightIcon = path.join(__dirname, '../assets/light/tray.png');
const darkIcon = path.join(__dirname, '../assets/dark/tray.png');

let menuIcon = null;

const buildMenuIcon = (capture, quit, setRGB) => {
  menuIcon = new Tray(nativeTheme.shouldUseDarkColors ? lightIcon : darkIcon);

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Capture', click: capture },
    { type: 'separator' },
    { label: 'Hex', type: 'radio', checked: true, click: () => setRGB(false) },
    {
      label: 'RGB',
      type: 'radio',
      click: () => setRGB(true),
    },
    { type: 'separator' },
    { label: 'Quit', click: quit },
  ]);

  menuIcon.setContextMenu(contextMenu);

  return menuIcon;
};

nativeTheme.on('updated', () =>
  menuIcon.setImage(nativeTheme.shouldUseDarkColors ? lightIcon : darkIcon)
);

module.exports = buildMenuIcon;
