import React from 'react';
import {
  AppRegistry,
  AppState,
  Environment,
  StyleSheet,
  NativeModules,
  Text,
  View,
  AsyncStorage,
} from 'react-360';
import { registerKeyboard } from 'react-360-keyboard';
const { VideoModule } = NativeModules;

console.log(AsyncStorage);

export default class student extends React.Component {
  constructor(props) {
    super(props);
    this.connectWS(props.hostname);
    this.state = {
      count: 90,
      greeting: 'Welcome to VRClassroom! Please enter your name!',
      showContent: false,
    };
    Environment.setBackgroundImage('static_assets/360_world.jpg');
  }

  componentDidMount() {
    this.sendClientName();
  }

  async sendClientName() {
    let value;

    try {
      value = await AsyncStorage.getItem('username');
    } catch (error) {
      console.log(error);
    }

    if (value) {
      this.ws.send(JSON.stringify({ clientName: value }));
    } else {
      setTimeout(() => this.askClientName(), 100);
    }
  }

  async askClientName() {
    const input = await NativeModules.Keyboard.startInput({
      placeholder: 'Enter your name',
    });

    try {
      await AsyncStorage.setItem('username', input);
    } catch (error) {
      console.log(error);
    }

    this.ws.send(JSON.stringify({ clientName: input }));
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
        this.setState({ showContent: true });
      } else if (data.url != '' && data.mediatype === 'video') {
        this.setState({ showContent: true });
        VideoModule.createPlayer('myplayer');
        VideoModule.play('myplayer', {
          source: { url: data.url }, // provide the path to the video
        });
        Environment.setBackgroundVideo('myplayer');
      } else {
        this.setState({ showContent: false });
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
        {!this.state.showContent ? (
          <View style={styles.greetingBox}>
            <Text style={styles.greeting}>{this.state.greeting}</Text>
          </View>
        ) : null}
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
