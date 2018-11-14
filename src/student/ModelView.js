import React from 'react';
import {View, NativeModules, Environment} from 'react-360';
import Entity from 'Entity';
import {connect} from './Store';

import AmbientLight from 'AmbientLight';
import PointLight from 'PointLight';

class ModelView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.mediatype != this.props.mediatype &&
      this.props.mediatype === 'model'
    ) {
      const hostname = NativeModules.HostnameModule.hostname;
      Environment.setBackgroundImage(`http://${hostname}:8082/360_world.jpg`);
    }
  }

  render() {
    if (!this.props.url || this.props.mediatype != 'model') {
      return null;
    }

    const source = {};
    if (this.props.url.endsWith('.obj')) {
      source.obj = this.props.url;
      source.mtl = this.props.url.replace('.obj', '.mtl');
    } else if (
      this.props.url.endsWith('.gltf') ||
      this.props.url.endsWith('.glb')
    ) {
      source.gltf2 = this.props.url;
    }

    const scaleFactor = this.props.scaleFactor || 1;

    return (
      <View>
        <AmbientLight intensity={1.0} color={'#ffffff'} />
        <PointLight
          intensity={0.4}
          style={{transform: [{translate: [0, 4, -1]}]}}
        />
        <Entity
          source={source}
          style={{
            transform: [
              {scale: [scaleFactor, scaleFactor, scaleFactor]},
              {rotateY: this.props.rotation || 0},
            ],
          }}
        />
      </View>
    );
  }
}

const ConnectedModelView = connect(ModelView);

export default ConnectedModelView;
