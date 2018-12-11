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
const {VideoModule, HostnameModule} = NativeModules;
import {connect} from './Store';
import Marker from './Marker';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

class CylinderView extends React.Component {
  state = {
    showContent: false,
    playbackPosition: -1,
  };

  componentDidMount() {
    VideoModule.createPlayer('myplayer');

    RCTDeviceEventEmitter.addListener('onVideoStatusChanged', e => {
      this.setState({
        playbackPosition: e.position,
      });
      console.log(e.status);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.showContent && nextProps.url) {
      this.setState({showContent: true});
    }

    if (this.props.url != nextProps.url) {
      if (nextProps.mediatype === 'video') {
        VideoModule.play('myplayer', {
          source: {
            url: nextProps.url,
          },
          autoPlay: false,
        });
        Environment.setBackgroundVideo('myplayer');
      } else if (nextProps.mediatype === 'photo') {
        Environment.setBackgroundImage(nextProps.url);
      }
    }

    if (this.props.playing != nextProps.playing) {
      if (nextProps.playing) {
        VideoModule.resume('myplayer');
        HostnameModule.userHasUnmutedVideo()
          .then(() => {
            VideoModule.setParams('myplayer', {muted: nextProps.muted});
          })
          .catch(() => {});
      } else {
        VideoModule.pause('myplayer');
      }
    }

    if (this.props.muted != nextProps.muted) {
      HostnameModule.userHasUnmutedVideo()
        .then(() => {
          VideoModule.setParams('myplayer', {muted: nextProps.muted});
        })
        .catch(() => {});
    }

    if (
      Math.abs(this.state.playbackPosition - nextProps.playbackPosition) > 1
    ) {
      VideoModule.seek('myplayer', nextProps.playbackPosition);
    }
  }

  render() {
    return (
      <View>
        {!this.state.showContent ? (
          <View style={{transform: [{translate: [300, -200]}]}}>
            <View style={styles.greetingBox}>
              <Text style={styles.greeting}>Willkommen bei VRClassroom!</Text>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  panel: {
    // Fill the entire surface
    width: 100,
    height: 60,
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

const ConnectedCylinderView = connect(CylinderView);

export default ConnectedCylinderView;
