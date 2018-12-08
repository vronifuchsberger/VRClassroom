import React from 'react';
import {View, NativeModules, Animated, asset} from 'react-360';
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

    return this.props.markers &&
      ((this.props.isModel && this.props.mediatype === 'model') ||
        (!this.props.isModel && this.props.mediatype !== 'model')) ? (
      <View>
        <AmbientLight intensity={1.0} color={'#ffffff'} />
        {this.props.markers.map((position, i) => {
          const distance = Math.sqrt(
            Math.pow(position[0], 2) +
              Math.pow(position[1], 2) +
              Math.pow(position[2], 2),
          );

          // scale inverse to marker's distance
          const scale = 0.01857 * distance + 0.14286;

          return (
            <AnimatedEntity
              key={i}
              style={[
                {
                  transform: [
                    {
                      translate: position,
                    },
                    {scale: [scale, scale, scale]},
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
                gltf2: asset('marker/marker.glb'),
              }}
            />
          );
        })}
      </View>
    ) : null;
  }
}

const ConnectedMarker = connect(Marker);

export default ConnectedMarker;
