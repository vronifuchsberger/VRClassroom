import React from 'react';
import {View} from 'react-360';
import {connect} from './Store';
import Entity from 'Entity';

class Marker extends React.Component {
  render() {
    return this.props.markers ? (
      <View>
        {this.props.markers.map((position, i) => (
          <Entity
            key={i}
            style={[
              {
                transform: [{translate: position}],
              },
            ]}
            source={{
              obj: `http://localhost:8082/uploads/spider/Only_Spider_with_Animations_Export.obj`,
              mtl: `http://localhost:8082/uploads/spider/Only_Spider_with_Animations_Export.mtl`,
              //gltf2: 'http://localhost:8082/uploads/cup/cup.glb',
            }}
          />
        ))}
      </View>
    ) : null;
  }
}

const ConnectedMarker = connect(Marker);

export default ConnectedMarker;
