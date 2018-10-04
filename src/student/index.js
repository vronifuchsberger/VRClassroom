import React from 'react';
import {
  AppRegistry,
  AppState,
  Environment,
  StyleSheet,
  NativeModules,
  Text,
  View,
} from 'react-360';
import { registerKeyboard } from 'react-360-keyboard';
const { VideoModule } = NativeModules;

export default class student extends React.Component {
  constructor(props) {
    super(props);
    this.connectWS(props.hostname);
    this.state = {
      count: 90,
      greeting: 'Welcome to VRClassroom! Please enter your name!',
    };
    Environment.setBackgroundImage('static_assets/360_world.jpg');
  }

  componentDidMount() {
    setTimeout(
      () =>
        NativeModules.Keyboard.startInput({
          placeholder: 'Enter your name',
        }).then(input => this.ws.send(JSON.stringify({ clientName: input }))),
      100,
    );
  }

  connectWS = hostname => {
    this.ws = new WebSocket(`ws://${hostname}:8888/`);
    this.ws.onopen = () => {
      if (this.reconnecter) {
        clearInterval(this.reconnecter);
      }
    };
    this.ws.onmessage = e => {
      // a message was received
      const data = JSON.parse(e.data);

      if (data.url != '' && data.mediatype === 'photo') {
        this.setState({ greeting: data.url });
        Environment.setBackgroundImage(data.url);
      } else if (data.url != '' && data.mediatype === 'video') {
        this.setState({ greeting: data.url });
        VideoModule.createPlayer('myplayer');
        VideoModule.play('myplayer', {
          source: { url: data.url }, // provide the path to the video
        });
        Environment.setBackgroundVideo('myplayer');
      }
    };

    this.ws.onclose = () => {
      this.reconnecter = setInterval(
        () => this.connectWS(this.props.hostname),
        1000,
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
    backgroundColor: 'rgba(255, 255, 255, 0)',
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
AppRegistry.registerComponent(...registerKeyboard);
