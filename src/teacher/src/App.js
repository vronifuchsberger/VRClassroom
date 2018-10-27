import React, {Component} from 'react';
import './App.css';
import {Button, Layout, Icon, Slider} from 'antd';
import Sidebar from './Sidebar';
const {Content} = Layout;
const WebSocketServer = window.require('ws');
const {ipcRenderer} = window.require('electron');
const initialContent = {
  mediatype: null,
  url: null,
  markers: [],
  playing: false,
  playbackPosition: -1,
  rotation: 0,
};

class App extends Component {
  state = {
    connectedClients: {},
    currentContent: initialContent,
  };

  componentDidMount() {
    this.setupWebsocketServer();
    ipcRenderer.on('open', (event, file) => {
      if (
        file.toLowerCase().endsWith('.jpg') ||
        file.toLowerCase().endsWith('.png') ||
        file.toLowerCase().endsWith('.gif')
      ) {
        this.broadcastToAllClients(
          {
            mediatype: 'photo',
            url: this.getUrl(file),
          },
          true,
        );
      } else if (
        file.toLowerCase().endsWith('.mkv') ||
        file.toLowerCase().endsWith('.mp4') ||
        file.toLowerCase().endsWith('.avi')
      ) {
        this.broadcastToAllClients(
          {
            mediatype: 'video',
            url: this.getUrl(file),
          },
          true,
        );
      } else if (
        file.toLowerCase().endsWith('.obj') ||
        file.toLowerCase().endsWith('.gltf') ||
        file.toLowerCase().endsWith('.glb')
      ) {
        this.broadcastToAllClients(
          {
            mediatype: 'model',
            url: this.getUrl(file),
          },
          true,
        );
      }
    });
  }

  getUrl(fileName) {
    return `http://${window.process.env.ip}:8082/uploads/${fileName}`;
  }

  // wait for tracker-app to load, before creating WebSocket server
  setupWebsocketServer = () => {
    this.wss = new WebSocketServer.Server({port: 8888});

    this.wss.on('connection', (ws, req) => {
      ws.send(JSON.stringify(this.state.currentContent));
      console.log('bbb');
      ws.on('message', message => {
        // message received from student
        const data = JSON.parse(message);

        // new client connected to websocket
        const userAgent = req.headers['user-agent'];
        this.setState({
          connectedClients: {
            ...this.state.connectedClients,
            [data.id]: {
              client: ws,
              userAgent: userAgent,
              clientName: data.clientName,
            },
          },
        });
      });

      ws.on('close', () => {
        const disconnectedID = Object.keys(this.state.connectedClients).find(
          id => {
            return this.state.connectedClients[id].client === ws;
          },
        );

        if (disconnectedID) {
          this.setState({
            connectedClients: {
              ...this.state.connectedClients,
              [disconnectedID]: {
                ...this.state.connectedClients[disconnectedID],
                client: null,
              },
            },
          });
        }
      });
    });
  };

  broadcastToAllClients = (message, reset) => {
    if (reset) {
      this.setState({currentContent: {...initialContent, ...message}});
    } else {
      this.setState({
        currentContent: {...this.state.currentContent, ...message},
      });
    }

    Object.values(this.state.connectedClients).forEach(({client}) => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  buttonClicked = () => {
    this.broadcastToAllClients({markers: [[20, 20, 0], [-40, -40, 0]]});
  };

  mediaButtonClicked = () => {};

  onSliderChange = value => {
    this.broadcastToAllClients({
      url: 'test',
      mediatype: 'model',
      rotation: value,
    });
  };

  render() {
    return (
      <div className="App">
        <Layout className="AppLayout">
          <Sidebar connectedClients={this.state.connectedClients} />
          <Content className="AppContent">
            <iframe title="3Dworld" src="http://localhost:8081/index.html" />
            <div className="Controls">
              <div style={{width: '800px'}}>
                <Slider width={300} max={360} onChange={this.onSliderChange} />
              </div>

              <Button type="primary" onClick={this.buttonClicked}>
                Button
              </Button>
              <Button type="primary" onClick={this.mediaButtonClicked}>
                Upload media
              </Button>
              <Button type="primary" onClick={this.markerMode}>
                <Icon type="edit" theme="outlined" />
              </Button>
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
