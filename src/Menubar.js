const {Menu, app, shell, dialog} = require('electron');

const fs = require('fs');
const path = require('path');

const {COPYFILE_EXCL} = fs.constants;
const defaultMenu = require('electron-default-menu');

const menu = defaultMenu(app, shell);

function getMenu(win) {
  const menu = defaultMenu(app, shell);
  menu.splice(1, 0, {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: (item, focusedWindow) => {
          dialog.showOpenDialog(
            win,
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
                // update menu
                Menu.setApplicationMenu(getMenu(win));

                win.webContents.send('open', fileName);
              });
            },
          );
        },
      },
      {
        label: 'Recent Media',
        submenu: fs
          .readdirSync(
            path.join(app.getAppPath(), 'src', 'student', 'public', 'uploads'),
          )
          .filter(file => !file.startsWith('.'))
          .map(file => ({
            label: file,
            click: () => {
              win.webContents.send('open', file);
            },
          })),
      },
    ],
  });

  return Menu.buildFromTemplate(menu);
}

module.exports = win => {
  // Set top-level application menu, using modified template
  Menu.setApplicationMenu(getMenu(win));
};
