import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Button from "antd/lib/button";
const { ipcRenderer } = window.require("electron");

class App extends Component {
  componentDidMount() {
    ipcRenderer.send("ready");
    ipcRenderer.on("client", function(event, message) {
      console.log("Message received: " + message);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button type="primary">Button</Button>
      </div>
    );
  }
}

export default App;
