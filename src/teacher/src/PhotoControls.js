import React, {Component} from 'react';
import MarkerControls from './MarkerControls';

class PhotoControls extends Component {
  render() {
    return (
      <div className="Controls">
        <div>Photo</div>
        <div className="spacer" />
        <MarkerControls {...this.props} />
      </div>
    );
  }
}

export default PhotoControls;
