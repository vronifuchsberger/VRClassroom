const {Menu, app, shell, dialog} = require('electron');

const fs = require('fs');
const path = require('path');

const {COPYFILE_EXCL} = fs.constants;
const defaultMenu = require('electron-default-menu');

const menu = defaultMenu(app, shell);

module.exports = win => {
  // Add custom menu
  menu.splice(1, 0, {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: (item, focusedWindow) => {
          dialog.showOpenDialog(
            {
              filters: [
                {name: 'Images', extensions: ['jpg', 'png', 'gif']},
                {name: 'Movies', extensions: ['mkv', 'avi', 'mp4']},
                {name: '3D models', extensions: ['obj', 'gltf2', 'gltf']},
              ],
              properties: ['openFile'],
            },
            filePaths => {
              const basepath = app.getAppPath();
              const fileName = path.basename(filePaths[0]);
              const newPath = path.join(
                basepath,
                'src',
                'student',
                'public',
                'uploads',
                fileName,
              );
              fs.copyFile(filePaths[0], newPath, COPYFILE_EXCL, a => {
                console.log(a);
                win.webContents.send('open', fileName);
              });
            },
          );
        },
      },
    ],
  });

  // Set top-level application menu, using modified template
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
};
