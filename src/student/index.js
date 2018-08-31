import React from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-360";
var ws = new WebSocket("ws://localhost:8888/");

export default class student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 90,
      greeting: "Well hello there!"
    };
  }

  handleData(data) {
    let result = JSON.parse(data);
    console.log("result: " + result);
  }

  componentDidMount() {
    ws.onopen = () => {
      // connection opened
      ws.send("Hello? Are you there?"); // send a message
    };
    ws.onmessage = e => {
      // a message was received
      console.log(e.data);

      if (e.data === "Button was clicked!") {
        console.log("Blabladfgdfgdbla");
        this.setState({ greeting: "Button was clicked!" });
      }
    };
  }

  render() {
    return (
      <View style={styles.panel}>
        <View style={styles.greetingBox}>
          <Text style={styles.greeting}>{this.state.greeting}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  panel: {
    // Fill the entire surface
    width: 1000,
    height: 600,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  greetingBox: {
    padding: 20,
    backgroundColor: "#000000",
    borderColor: "#639dda",
    borderWidth: 2
  },
  greeting: {
    fontSize: 30
  }
});

AppRegistry.registerComponent("student", () => student);
