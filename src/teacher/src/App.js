import React, { Component } from 'react';
import './App.css';
import { Button, List, Layout } from 'antd';
const { Sider, Content } = Layout;
const WebSocketServer = window.require('ws');
const { ipcRenderer } = window.require('electron');

class App extends Component {
  state = {
    connectedClients: [],
  };

  componentDidMount() {
    this.setupWebsocketServer();
  }

  // wait for tracker-app to load, before creating WebSocket server
  setupWebsocketServer = () => {
    this.wss = new WebSocketServer.Server({ port: 8888 });

    this.wss.on('connection', (ws, req) => {
      // new client connected to websocket
      const userAgent = req.headers['user-agent'];
      this.setState({
        connectedClients: [
          ...this.state.connectedClients,
          { client: ws, userAgent },
        ],
      });

      ws.on('message', message => {
        // message received from student
        console.log(message);
        const data = JSON.parse(message);

        if (data.clientName) {
          const connectedClients = this.state.connectedClients.map(client => {
            if (client.client === ws) {
              return { ...client, clientName: data.clientName };
            } else {
              return client;
            }
          });

          this.setState({ connectedClients });
        }
      });

      ws.on('close', () => {
        // remove client from connectedClients
        this.setState({
          connectedClients: this.state.connectedClients.filter(
            ({ client }) => client !== ws,
          ),
        });
      });
    });
  };

  broadcastToAllClients = message => {
    this.state.connectedClients.forEach(({ client }) => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(message);
      }
    });
  };

  buttonClicked = () => {
    const url = `http://${window.process.env.ip}:8082/uploads/test.jpg`;
    this.broadcastToAllClients(
      JSON.stringify({ url: url, mediatype: 'photo' }),
    );
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

  uploadMedia = path => {
    ipcRenderer.send('upload', path);
  };

  render() {
    return (
      <div className="App">
        <Layout>
          <Sider theme="light">
            <List
              header="Connected Clients:"
              dataSource={this.state.connectedClients}
              size="small"
              renderItem={(client, i) => (
                <List.Item key={i}>{this.getDeviceName(client)}</List.Item>
              )}
            />
          </Sider>
          <Content>
            <Button type="primary" onClick={this.buttonClicked}>
              Button
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
