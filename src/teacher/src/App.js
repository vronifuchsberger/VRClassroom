import React, { Component } from 'react';
import './App.css';
import { Button, List, Layout, Badge } from 'antd';
const { Sider, Content } = Layout;
const WebSocketServer = window.require('ws');
const remote = window.require('electron').remote;
const { dialog } = remote;

class App extends Component {
  state = {
    connectedClients: {},
  };

  componentDidMount() {
    this.setupWebsocketServer();
  }

  // wait for tracker-app to load, before creating WebSocket server
  setupWebsocketServer = () => {
    this.wss = new WebSocketServer.Server({ port: 8888 });

    this.wss.on('connection', (ws, req) => {
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

  broadcastToAllClients = message => {
    Object.values(this.state.connectedClients).forEach(({ client }) => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(message);
      }
    });
  };

  buttonClicked = () => {
    const url = `http://${window.process.env.ip}:8082/uploads/video.MP4`;
    this.broadcastToAllClients(
      JSON.stringify({ url: url, mediatype: 'video' }),
    );
  };

  mediaButtonClicked = () => {
    dialog.showOpenDialog({
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
        { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
      ],
      properties: ['openFile'],
    });
  };

  getDeviceName = client => {
    if (client.clientName) {
      return client.clientName;
    } else if (client.userAgent.indexOf('OculusBrowser') > -1) {
      return 'Oculus Device';
    } else if (client.userAgent.indexOf('iPhone') > -1) {
      return 'iPhone';
    } else if (client.userAgent.indexOf('Electron') > -1) {
      return 'Teacher App';
    } else if (client.userAgent.indexOf('Chrome') > -1) {
      return 'Chrome';
    } else {
      return 'Unknown device';
    }
  };

  render() {
    return (
      <div className="App">
        <Layout>
          <Sider theme="light">
            <List
              header="Connected Clients:"
              dataSource={Object.values(this.state.connectedClients)}
              size="small"
              renderItem={(client, i) => (
                <List.Item key={i}>
                  <Badge status={client.client ? 'success' : 'error'} />
                  {this.getDeviceName(client)}
                </List.Item>
              )}
            />
          </Sider>
          <Content>
            <Button type="primary" onClick={this.buttonClicked}>
              Button
            </Button>
            <Button type="primary" onClick={this.mediaButtonClicked}>
              Upload media
            </Button>
            <iframe
              title="3Dworld"
              src="http://localhost:8081/index.html"
              width="400"
              height="400"
            />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
