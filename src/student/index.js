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
  asset,
} from 'react-360';
import Entity from 'Entity';
import {registerKeyboard} from 'react-360-keyboard';
const {VideoModule} = NativeModules;

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

  async askClientName() {
    const input = await NativeModules.Keyboard.startInput({
      placeholder: 'Enter your name',
    });

    try {
      await AsyncStorage.setItem('username', input);
    } catch (error) {
      console.log(error);
    }

    this.sendClientInfo();
  }

  sendClientInfo = async () => {
    const clientName = await AsyncStorage.getItem('username');
    let id = await AsyncStorage.getItem('id');

    if (!id) {
      id = Math.random().toString(36);
      AsyncStorage.setItem('id', id);
    }
    // generate ID if not exisitent
    this.ws.send(JSON.stringify({clientName: clientName, id: id}));
    if (!clientName) {
      setTimeout(() => this.askClientName(), 100);
    }
  };

  connectWS = hostname => {
    this.ws = new WebSocket(`ws://${hostname}:8888/`);
    this.ws.onopen = () => {
      this.sendClientInfo();
      if (this.reconnecter) {
        clearInterval(this.reconnecter);
      }
    };
    this.ws.onmessage = e => {
      // a message was received
      const data = JSON.parse(e.data);

      if (data.url != '' && data.mediatype === 'photo') {
        this.setState({greeting: data.url});
        Environment.setBackgroundImage(data.url);
        this.setState({showContent: true});
      } else if (data.url != '' && data.mediatype === 'video') {
        this.setState({showContent: true});
        VideoModule.createPlayer('myplayer');
        VideoModule.play('myplayer', {
          source: {url: data.url}, // provide the path to the video
        });
        Environment.setBackgroundVideo('myplayer');
      } else {
        this.setState({showContent: false});
      }
    };

    this.ws.onclose = () => {
      this.reconnecter = setInterval(
        () => this.connectWS(this.props.hostname),
        1000,
      );
    };
  };

  render() {
    return (
      <View style={styles.panel}>
        <Entity
          source={{
            obj:
              'http://localhost:8082/uploads/spider/Only_Spider_with_Animations_Export.obj',
            mtl:
              'http://localhost:8082/uploads/spider/Only_Spider_with_Animations_Export.mtl',
          }}
          style={{
            transform: [{rotateX: 90}, {rotateY: 90}],
          }}
        />
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
