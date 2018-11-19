import React, {Component} from 'react';
import {Button} from 'antd';

class PhotoControls extends Component {
  state = {};

  resetMarkers = () => {
    this.props.broadcastToAllClients({
      markers: [],
    });
  };

  render() {
    return (
      <div className="Controls">
        <Button
          type="primary"
          onClick={this.props.toggleAddingMarker}
          ghost={!this.props.allowAddingMarker}
        >
          Marker setzen
        </Button>
        <Button
          type="primary"
          onClick={this.resetMarkers}
          disabled={this.props.currentContent.markers.length === 0}
        >
          Marker zurücksetzen
        </Button>
      </div>
    );
  }
}

export default PhotoControls;
