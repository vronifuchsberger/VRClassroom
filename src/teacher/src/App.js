import React, {Component} from 'react';
import './App.css';
import {Layout} from 'antd';
import Sidebar from './Sidebar';
import PhotoControls from './PhotoControls';
import VideoControls from './VideoControls';
import ModelControls from './ModelControls';
const {Content} = Layout;
const WebSocketServer = window.require('ws');
const {ipcRenderer, remote} = window.require('electron');
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
    allowAddingMarker: false,
    videoDuration: -1,
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
            playbackPosition: 0,
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
        if (client && client.readyState === WebSocketServer.OPEN) {
          client.send(JSON.stringify(this.state.currentContent));
        }
      });
    }
  }

  getUrl(fileName) {
    return `http://${window.process.env.ip}:8082/assets/${fileName}`;
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
          if (
            this.state.allowAddingMarker &&
            ((this.state.currentContent.mediatype === 'model' &&
              data.markerAdded.didHitModel) ||
              this.state.currentContent.mediatype !== 'model')
          ) {
            this.setState({
              allowAddingMarker: false,
            });
            this.broadcastToAllClients({
              markers: [
                ...this.state.currentContent.markers,
                data.markerAdded.position,
              ],
            });
          }
        } else if (data.videoStatus) {
          this.setState({
            videoDuration: data.videoStatus.duration,
          });
          this.broadcastToAllClients({
            playbackPosition: data.videoStatus.position,
          });
        } else {
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
        }
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

  toggleAddingMarker = () => {
    this.setState({
      allowAddingMarker: !this.state.allowAddingMarker,
    });
  };

  render() {
    return (
      <div className="App">
        <Layout className="AppLayout">
          <Sidebar connectedClients={this.state.connectedClients} />
          <Content className="AppContent">
            <iframe
              title="3Dworld"
              src={
                remote.app.isPackaged
                  ? 'http://localhost:8082/student/index.html?teacher'
                  : 'http://localhost:8081/index.html?teacher'
              }
            />
            {this.state.currentContent.mediatype === 'model' && (
              <ModelControls
                broadcastToAllClients={this.broadcastToAllClients}
                currentContent={this.state.currentContent}
                allowAddingMarker={this.state.allowAddingMarker}
                toggleAddingMarker={this.toggleAddingMarker}
              />
            )}
            {this.state.currentContent.mediatype === 'photo' && (
              <PhotoControls
                broadcastToAllClients={this.broadcastToAllClients}
                currentContent={this.state.currentContent}
                allowAddingMarker={this.state.allowAddingMarker}
                toggleAddingMarker={this.toggleAddingMarker}
              />
            )}
            {this.state.currentContent.mediatype === 'video' && (
              <VideoControls
                broadcastToAllClients={this.broadcastToAllClients}
                currentContent={this.state.currentContent}
                allowAddingMarker={this.state.allowAddingMarker}
                toggleAddingMarker={this.toggleAddingMarker}
                videoDuration={this.state.videoDuration}
              />
            )}
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
