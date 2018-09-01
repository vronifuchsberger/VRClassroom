import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'antd/lib/button';
const WebSocketServer = window.require('ws');

class App extends Component {
  state = {
    connectedClients: [],
  };

  componentDidMount() {
    this.setupWebsocketServer();
  }

  // wait for tracker-app to load, before creating WebSocket server
  setupWebsocketServer = () => {
    this.wss = new WebSocketServer.Server({port: 8888});

    this.wss.on('connection', (ws, req) => {
      // new client connected to websocket
      const userAgent = req.headers['user-agent'];
      this.setState({
        connectedClients: [
          ...this.state.connectedClients,
          {client: ws, userAgent},
        ],
      });

      ws.on('message', message => {
        // message received from student
        console.log(message);
      });

      ws.on('close', () => {
        // remove client from connectedClients
        this.setState({
          connectedClients: this.state.connectedClients.filter(
            ({client}) => client !== ws
          ),
        });
      });
    });
  };

  broadcastToAllClients = message => {
    this.state.connectedClients.forEach(({client}) => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(message);
      }
    });
  };

  buttonClicked = () => {
    this.broadcastToAllClients('clicked');
  };

  getDeviceName = userAgent => {
    if (userAgent.indexOf('OculusBrowser') > -1) {
      return 'Oculus Device';
    } else if (userAgent.indexOf('iPhone') > -1) {
      return 'iPhone';
    } else if (userAgent.indexOf('Electron') > -1) {
      return 'Teacher App';
    } else if (userAgent.indexOf('Chrome') > -1) {
      return 'Chrome';
    } else {
      return 'Unknown device';
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ul>
          {this.state.connectedClients.map(({userAgent}, i) => (
            <li key={i}>{this.getDeviceName(userAgent)}</li>
          ))}
        </ul>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button type="primary" onClick={this.buttonClicked}>
          Button
        </Button>
        <iframe
          title="3Dworld"
          src="http://localhost:8081/index.html"
          width="400"
          height="400"
        />
      </div>
    );
  }
}

export default App;
