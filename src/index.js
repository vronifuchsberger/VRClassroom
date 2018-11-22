// electron main process
const {app, BrowserWindow, ipcMain} = require('electron');
const {spawn, exec} = require('child_process');
const path = require('path');
const terminate = require('terminate');
const os = require('os');
const cors = require('cors');
const nocache = require('nocache');
const express = require('express');
const fs = require('fs-extra');
const Menubar = require('./Menubar');

const networkInterfaces = os.networkInterfaces();
const assetDir = path.join(os.homedir(), '.vrclassroom');
const isProduction = app.isPackaged;

let win;
let win2;
let windowsLoaded = false;

process.env.ip = getMyIP();

function getMyIP() {
  for (let k in networkInterfaces) {
    const inter = networkInterfaces[k];
    for (let j in inter) {
      if (inter[j].family === 'IPv4' && !inter[j].internal) {
        return inter[j].address;
      }
    }
  }
}

//create asset directory if it doesn't exist
if (!fs.existsSync(assetDir)) {
  fs.mkdirSync(assetDir);
}

const VRProduction = express();
VRProduction.use(cors());
VRProduction.use(nocache());
VRProduction.use('/assets', express.static(assetDir));
if (isProduction) {
  VRProduction.use('/teacher', express.static(path.join(__dirname, 'teacher')));
  VRProduction.use('/student', express.static(path.join(__dirname, 'student')));
} else {
  // create-react-app dev server starten
  const CRAprocess = spawn('yarn', ['start'], {
    cwd: path.join(__dirname, 'teacher'),
  });

  const VRprocess = spawn('yarn', ['start'], {
    cwd: path.join(__dirname, 'student'),
  });

  CRAprocess.stdout.on('data', data => {
    console.log(String(data));
    // when CRA has compiled everything, load URL in window
    if (
      String(data)
        .trim()
        .startsWith('Compiled') &&
      !windowsLoaded
    ) {
      win.loadURL('http://localhost:3000');
      win2.loadURL(
        `http://localhost:3000/qrCode.html?url=http://${getMyIP()}:8081/index.html`,
      );
      windowsLoaded = true;
    }
  });

  app.on('before-quit', e => {
    // prevent regular shutdown
    e.preventDefault();
    // terminate child processes first
    terminate(CRAprocess.pid, () => {
      terminate(VRprocess.pid, () => {
        // termiante main app, once child processes are closed
        process.exit();
      });
    });
  });
}

VRProduction.listen(8082, () => {
  console.log(`Example app listening on port ${8082}!`);
});

ipcMain.on('upload', (event, pathname) => {
  event.sender.send('upload', 'putNewPathHere');
});

app.on('ready', () => {
  win = new BrowserWindow({width: 1280, height: 960});
  win2 = new BrowserWindow({width: 440, height: 500});

  if (isProduction) {
    win.loadURL('http://localhost:8082/teacher');
    win2.loadURL(
      `http://localhost:8082/teacher/qrCode.html?url=http://${getMyIP()}:8082/student/index.html`,
    );
    windowsLoaded = true;
  }

  Menubar(win, assetDir);
});

// quit app once all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});
