import React from 'react';
import {View, NativeModules, Animated} from 'react-360';
import {connect} from './Store';
import Entity from 'Entity';
import AmbientLight from 'AmbientLight';
import {Easing} from 'react-native';

const AnimatedEntity = Animated.createAnimatedComponent(Entity);

class Marker extends React.Component {
  state = {
    rotateAnim: new Animated.Value(0),
  };

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation() {
    this.state.rotateAnim.setValue(0);
    Animated.timing(this.state.rotateAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start(() => {
      this.startAnimation();
    });
  }

  render() {
    const hostname = NativeModules.HostnameModule.hostname;
    return this.props.markers ? (
      <View>
        <AmbientLight intensity={1.0} color={'#ffffff'} />
        {this.props.markers.map((position, i) => (
          <AnimatedEntity
            key={i}
            style={[
              {
                transform: [
                  {
                    translate: position.map(x => x * 800),
                  },
                  {scale: [15, 15, 15]},
                  {
                    rotateY: this.state.rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
            source={{
              gltf2: `http://${hostname}:8082/marker/marker1.glb`,
            }}
          />
        ))}
      </View>
    ) : null;
  }
}

const ConnectedMarker = connect(Marker);

export default ConnectedMarker;
