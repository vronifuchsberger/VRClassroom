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
import Entity from 'Entity';
const {VideoModule} = NativeModules;
import {connect} from './Store';
import Marker from './Marker';

class CylinderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 90,
      greeting: 'Welcome to VRClassroom! Please enter your name!',
      showContent: false,
    };
  }

  componentDidUpdate() {
    console.log(this.props);

    if (this.props.mediatype === 'video' && this.props.url) {
      VideoModule.createPlayer('myplayer');
      VideoModule.play('myplayer', {
        source: {url: this.props.url}, // provide the path to the video
      });
      Environment.setBackgroundVideo('myplayer');
    } else if (this.props.mediatype === 'photo' && this.props.url) {
      Environment.setBackgroundImage(this.props.url);
    }
  }

  render() {
    return (
      <View>
        <View style={styles.panel}>
          {!this.state.showContent ? (
            <View style={styles.greetingBox}>
              <Text style={styles.greeting}>{this.state.greeting}</Text>
            </View>
          ) : null}
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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

const ConnectedCylinderView = connect(CylinderView);

export default ConnectedCylinderView;
