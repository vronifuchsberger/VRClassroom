// electron main process
const {app, BrowserWindow} = require('electron');
const {spawn, exec} = require('child_process');
const path = require('path');
const terminate = require('terminate');
let win;

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
  if (String(data).trim() === 'Compiled successfully!') {
    win.loadURL('http://localhost:3000');
  }
});

app.on('ready', () => {
  win = new BrowserWindow({width: 800, height: 600});
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
