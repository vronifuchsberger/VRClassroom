import React, {Component} from 'react';
import MarkerControls from './MarkerControls';

class PhotoControls extends Component {
  render() {
    return (
      <div className="Controls">
        <div className="spacing">
          {this.props.currentContent.url.split('/').pop()}
        </div>
        <MarkerControls {...this.props} />
      </div>
    );
  }
}

export default PhotoControls;
