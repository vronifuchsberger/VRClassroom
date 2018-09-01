import React from 'react';
import {
  AppRegistry,
  AppState,
  Environment,
  StyleSheet,
  Text,
  View,
} from 'react-360';

export default class student extends React.Component {
  constructor(props) {
    super(props);
    this.connectWS(props.hostname);
    this.state = {
      count: 90,
      greeting: 'Well hello there!',
    };
    Environment.setBackgroundImage('static_assets/360_world.jpg');
  }

  connectWS = hostname => {
    this.ws = new WebSocket(`ws://${hostname}:8888/`);
    this.ws.onopen = () => {
      if (this.reconnecter) {
        clearInterval(this.reconnecter);
      }
      // connection opened
      //this.ws.send(String(this.props.vendor)); // send a message
    };
    this.ws.onmessage = e => {
      // a message was received
      console.log(e.data);

      if (e.data === 'clicked') {
        this.setState({greeting: 'Button was clicked!'});
      }
    };

    this.ws.onclose = () => {
      this.reconnecter = setInterval(
        () => this.connectWS(this.props.hostname),
        1000
      );
    };
  };

  handleData(data) {
    let result = JSON.parse(data);
    console.log('result: ' + result);
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingBox: {
    padding: 20,
    backgroundColor: '#000000',
    borderColor: '#639dda',
    borderWidth: 2,
  },
  greeting: {
    fontSize: 30,
  },
});

AppRegistry.registerComponent('student', () => student);
