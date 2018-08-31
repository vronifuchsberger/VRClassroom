// electron main process
const { app, BrowserWindow } = require("electron");
const { spawn, exec } = require("child_process");
const path = require("path");
const terminate = require("terminate");
const WebSocket = require("ws");
const { ipcMain } = require("electron");
let win, wss;

// create-react-app dev server starten
const CRAprocess = spawn("yarn", ["start"], {
  cwd: path.join(__dirname, "teacher")
});

CRAprocess.stdout.on("data", data => {
  // when CRA has compiled everything, load URL in window
  if (String(data).trim() === "Compiled successfully!") {
    win.loadURL("http://localhost:3000");
  }
});

// wait for tracker-app to load, before creating WebSocket server
ipcMain.on("ready", () => {
  wss = new WebSocket.Server({ port: 8888 });

  wss.on("connection", function connection(ws) {
    // new client connected to websocket
    win.webContents.send("client", "connected");
    ws.on("message", function incoming(message) {
      win.webContents.send("client", message);
      ws.send("Oh, yeah! I'm right here!");
    });

    ws.send("Ready!!");
  });
});

app.on("ready", () => {
  win = new BrowserWindow({ width: 800, height: 600 });
});

app.on("before-quit", e => {
  // prevent regular shutdown
  e.preventDefault();
  // terminate child processes first
  terminate(CRAprocess.pid, () => {
    // termiante main app, once child processes are closed
    process.exit();
  });
});
