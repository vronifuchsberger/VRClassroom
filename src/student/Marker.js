import React from 'react';
import {View, NativeModules} from 'react-360';
import {connect} from './Store';
import Entity from 'Entity';
import AmbientLight from 'AmbientLight';

class Marker extends React.Component {
  render() {
    const hostname = NativeModules.HostnameModule.hostname;
    return this.props.markers ? (
      <View>
        <AmbientLight intensity={1.0} color={'#ffffff'} />
        {this.props.markers.map((position, i) => (
          <Entity
            key={i}
            style={[
              {
                transform: [
                  {
                    translate: position.map(x => x * 800),
                  },
                ],
              },
            ]}
            source={{
              //obj: `http://localhost:8082/uploads/spider/Only_Spider_with_Animations_Export.obj`,
              //mtl: `http://localhost:8082/uploads/spider/Only_Spider_with_Animations_Export.mtl`,
              gltf2: `http://${hostname}:8082/uploads/cup.glb`,
            }}
          />
        ))}
      </View>
    ) : null;
  }
}

const ConnectedMarker = connect(Marker);

export default ConnectedMarker;
