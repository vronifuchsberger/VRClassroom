const {Menu, app, shell, dialog} = require('electron');

const fs = require('fs-extra');
const path = require('path');
const prompt = require('./prompt');

const {COPYFILE_EXCL} = fs.constants;
const defaultMenu = require('electron-default-menu');

const menu = defaultMenu(app, shell);
const uploadFolder = path.join(
  app.getAppPath(),
  'src',
  'student',
  'public',
  'uploads',
);

function containsObj(filePath) {
  return fs
    .readdirSync(filePath)
    .find(file => file.toLowerCase().endsWith('.obj'));
}

function getMenu(win) {
  const menu = defaultMenu(app, shell);
  menu.splice(1, 0, {
    label: 'File',
    submenu: [
      {
        label: 'Open...',
        accelerator: 'CmdOrCtrl+O',
        click: (item, focusedWindow) => {
          dialog.showOpenDialog(
            win,
            {
              filters: [
                {
                  name: 'Dateien',
                  extensions: [
                    'jpg',
                    'png',
                    'gif',
                    'mkv',
                    'avi',
                    'mp4',
                    'obj',
                    'gltf2',
                    'gltf',
                    'glb',
                  ],
                },
              ],
              properties: ['openFile', 'openDirectory'],
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
              if (fs.lstatSync(filePaths[0]).isDirectory()) {
                const objFile = containsObj(filePaths[0]);
                if (objFile) {
                  // copy entire folder
                  fs.copy(filePaths[0], newPath, a => {
                    console.log(a);
                    // update menu
                    Menu.setApplicationMenu(getMenu(win));

                    win.webContents.send('open', path.join(fileName, objFile));
                  });
                } else {
                  dialog.showErrorBox(
                    'Ordner enthalt keine .obj-Datei',
                    'Es konnen nur Ordner, die .obj-Modellen enthalten, geladen werden.',
                  );
                }
              } else if (
                fileName.endsWith('.obj') &&
                fs.existsSync(filePaths[0].replace('.obj', '.mtl'))
              ) {
                dialog.showErrorBox(
                  'OBJ Modell besteht aus mehreren Dateien',
                  'Dieses Modell besteht aus mehreren einzelnen Dateien (.obj, .mtl und ggf. Texturen). Um dieses OBJ-Modell zu laden muss der gesamte Ordner mit allen benötigten Dateien geöffnet werden',
                );
              } else if (
                fileName.endsWith('.gltf') &&
                fs.existsSync(filePaths[0].replace('.gltf', '.bin'))
              ) {
                fs.copyFileSync(
                  filePaths[0].replace('.gltf', '.bin'),
                  newPath.replace('.gltf', '.bin'),
                  COPYFILE_EXCL,
                );
                fs.copyFile(filePaths[0], newPath, COPYFILE_EXCL, a => {
                  console.log(a);
                  // update menu
                  Menu.setApplicationMenu(getMenu(win));
                  win.webContents.send('open', fileName);
                });
              } else {
                fs.copyFile(filePaths[0], newPath, COPYFILE_EXCL, a => {
                  console.log(a);
                  // update menu
                  Menu.setApplicationMenu(getMenu(win));

                  win.webContents.send('open', fileName);
                });
              }
            },
          );
        },
      },
      {
        label: 'Recent Media',
        submenu: fs
          .readdirSync(uploadFolder)
          .filter(file => !file.startsWith('.') && !file.endsWith('.bin'))
          .map(file => ({
            label: file,
            click: () => {
              if (fs.lstatSync(path.join(uploadFolder, file)).isDirectory()) {
                const objFile = containsObj(path.join(uploadFolder, file));
                file = path.join(file, objFile);
              }
              win.webContents.send('open', file);
            },
          })),
      },
      {
        label: 'Open StreetView...',
        click: () => {
          prompt(win);
        },
      },
    ],
  });

  return Menu.buildFromTemplate(menu);
}

module.exports = win => {
  // Set top-level application menu, using modified template
  Menu.setApplicationMenu(getMenu(win));
};
