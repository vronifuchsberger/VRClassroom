import React, {Component} from 'react';
import './App.css';
import {Button, Layout, Icon, Slider, Radio} from 'antd';
import Sidebar from './Sidebar';
const {Content} = Layout;
const WebSocketServer = window.require('ws');
const {ipcRenderer} = window.require('electron');
const initialContent = () => ({
  mediatype: null,
  url: null,
  markers: [],
  playing: false,
  playbackPosition: -1,
  rotation: 0,
  scaleFactor: 1,
});

class App extends Component {
  state = {
    connectedClients: {},
    currentContent: initialContent(),
    sliderMode: 'rotation',
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
    ipcRenderer.on('streetview', (event, url) => {
      this.broadcastToAllClients(
        {
          mediatype: 'photo',
          url: url,
        },
        true,
      );
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentContent !== this.state.currentContent) {
      Object.values(this.state.connectedClients).forEach(({client}) => {
        if (client.readyState === WebSocketServer.OPEN) {
          client.send(JSON.stringify(this.state.currentContent));
        }
      });
    }
  }

  getUrl(fileName) {
    return `http://${window.process.env.ip}:8082/uploads/${fileName}`;
  }

  // wait for tracker-app to load, before creating WebSocket server
  setupWebsocketServer = () => {
    this.wss = new WebSocketServer.Server({
      port: 8888,
    });

    this.wss.on('connection', (ws, req) => {
      ws.send(JSON.stringify(this.state.currentContent));
      ws.on('message', message => {
        // message received from student
        const data = JSON.parse(message);

        if (data.markerAdded) {
          this.broadcastToAllClients({
            markers: [...this.state.currentContent.markers, data.markerAdded],
          });
          return;
        }

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
      this.setState({
        currentContent: {
          ...initialContent(),
          ...message,
        },
      });
    } else {
      this.setState({
        currentContent: {
          ...this.state.currentContent,
          ...message,
        },
      });
    }
  };

  resetMarkers = () => {
    this.broadcastToAllClients({
      markers: [],
    });
  };

  onSliderChange = value => {
    this.broadcastToAllClients({
      [this.state.sliderMode]: value,
    });
  };

  changeSliderMode = e => {
    this.setState({
      sliderMode: e.target.value,
    });
  };

  render() {
    const sliderMax = this.state.sliderMode === 'rotation' ? 360 : 10;
    const sliderValue = this.state.currentContent[this.state.sliderMode];

    return (
      <div className="App">
        <Layout className="AppLayout">
          <Sidebar connectedClients={this.state.connectedClients} />
          <Content className="AppContent">
            <iframe title="3Dworld" src="http://localhost:8081/index.html" />
            <div className="Controls">
              <Radio.Group
                value={this.state.sliderMode}
                onChange={this.changeSliderMode}
                buttonStyle="solid"
              >
                <Radio.Button value="rotation">Drehen</Radio.Button>
                <Radio.Button value="scaleFactor">Skalieren</Radio.Button>
              </Radio.Group>
              <div className="Slider">
                <Slider
                  width={200}
                  max={sliderMax}
                  value={sliderValue}
                  onChange={this.onSliderChange}
                  step={0.01}
                  tipFormatter={null}
                />
              </div>
              <Button type="primary" onClick={this.resetMarkers}>
                Marker zurücksetzen
              </Button>
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
