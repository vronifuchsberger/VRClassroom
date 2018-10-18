import React from 'react';
import {View} from 'react-360';
import Entity from 'Entity';
import {connect} from './Store';

class ModelView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        {
          <Entity
            source={{
              obj:
                'http://localhost:8082/uploads/spider/Only_Spider_with_Animations_Export.obj',
              mtl:
                'http://localhost:8082/uploads/spider/Only_Spider_with_Animations_Export.mtl',
              //gltf2: 'http://localhost:8082/uploads/cup/cup.glb',
            }}
          />
        }
      </View>
    );
  }
}

const ConnectedModelView = connect(ModelView);

export default ConnectedModelView;
