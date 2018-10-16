// electron main process
const {app, BrowserWindow} = require('electron');
const {spawn, exec} = require('child_process');
const path = require('path');
const terminate = require('terminate');
let win;
let win2;
const networkInterfaces = require('os').networkInterfaces();
const {ipcMain} = require('electron');
const express = require('express');
const cors = require('cors');
process.env.ip = getMyIP();

// create-react-app dev server starten
const CRAprocess = spawn('yarn', ['start'], {
  cwd: path.join(__dirname, 'teacher'),
});

const VRprocess = spawn('yarn', ['start'], {
  cwd: path.join(__dirname, 'student'),
});

const VRProduction = express();
VRProduction.use(cors());
VRProduction.use(express.static(path.join(__dirname, 'student', 'public')));
VRProduction.listen(8082, () =>
  console.log(`Example app listening on port ${8082}!`),
);

CRAprocess.stdout.on('data', data => {
  console.log(String(data));
  // when CRA has compiled everything, load URL in window
  if (String(data).trim() === 'Compiled successfully!') {
    win.loadURL('http://localhost:3000');
    win2.loadURL(
      `http://localhost:3000/qrCode.html?url=http://${getMyIP()}:8081/index.html`,
    );
  }
});

ipcMain.on('upload', (event, pathname) => {
  console.log(pathname);
  event.sender.send('upload', 'putNewPathHere');
});

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

app.on('ready', () => {
  win = new BrowserWindow({width: 1280, height: 960});
  win2 = new BrowserWindow({width: 440, height: 500});
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
