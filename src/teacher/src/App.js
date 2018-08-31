import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Button from "antd/lib/button";
const WebSocketServer = window.require("ws");

class App extends Component {
  state = {
    connectedClients: []
  };

  componentDidMount() {
    this.setupWebsocketServer();
  }

  // wait for tracker-app to load, before creating WebSocket server
  setupWebsocketServer = () => {
    this.wss = new WebSocketServer.Server({ port: 8888 });

    this.wss.on("connection", ws => {
      // new client connected to websocket
      this.setState({
        connectedClients: [...this.state.connectedClients, ws]
      });

      ws.on("message", message => {
        // message received from student
      });

      ws.on("close", () => {
        // remove client from connectedClients
        this.setState({
          connectedClients: this.state.connectedClients.filter(
            client => client !== ws
          )
        });
      });
    });
  };

  broadcastToAllClients = message => {
    this.state.connectedClients.forEach(client => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(message);
      }
    });
  };

  buttonClicked() {
    this.broadcastToAllClients("clicked");
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ul>
          {this.state.connectedClients.map((client, i) => (
            <li key={i}>Client {i}</li>
          ))}
        </ul>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button type="primary" onClick={this.buttonClicked}>
          Button
        </Button>
        <iframe
          src="http://localhost:8081/index.html"
          width="400"
          height="400"
        />
      </div>
    );
  }
}

export default App;
