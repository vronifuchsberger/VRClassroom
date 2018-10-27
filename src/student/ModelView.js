import React from 'react';
import {View, NativeModules} from 'react-360';
import Entity from 'Entity';
import {connect} from './Store';

import AmbientLight from 'AmbientLight';
import PointLight from 'PointLight';

class ModelView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.url || this.props.mediatype != 'model') {
      return null;
    }
    const hostname = NativeModules.HostnameModule.hostname;
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

    return (
      <View>
        <AmbientLight intensity={1.0} color={'#ffffff'} />
        <PointLight
          intensity={0.4}
          style={{transform: [{translate: [0, 4, -1]}]}}
        />
        <Entity
          source={source}
          style={
            {
              //transform: [{scale: [10, 10, 10]}],
            }
          }
        />
      </View>
    );
  }
}

const ConnectedModelView = connect(ModelView);

export default ConnectedModelView;