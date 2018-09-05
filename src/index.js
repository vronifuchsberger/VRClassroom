// electron main process
const {app, BrowserWindow} = require('electron');
const {spawn, exec} = require('child_process');
const path = require('path');
const terminate = require('terminate');
let win;
let win2;
const networkInterfaces = require('os').networkInterfaces();

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
    win2.loadURL(
      `http://localhost:3000/qrCode.html?url=http://${getMyIP()}:8081/index.html`
    );
  }
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
  win = new BrowserWindow({width: 800, height: 600});
  win2 = new BrowserWindow({width: 320, height: 360});
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
