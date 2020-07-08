const { Tray, nativeTheme } = require('electron');
const path = require('path');
const lightIcon = path.join(__dirname, './resources/light3.png');
const darkIcon = path.join(__dirname, './resources/dark3.png');

let menuIcon = null;

const buildMenuIcon = (capture, quit) => {
  menuIcon = new Tray(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon);
  menuIcon.on('click', capture);
  menuIcon.on('right-click', quit);
  return menuIcon;
};

nativeTheme.on('updated', () =>
  menuIcon.setImage(nativeTheme.shouldUseDarkColors ? darkIcon : lightIcon)
);

module.exports = buildMenuIcon;
