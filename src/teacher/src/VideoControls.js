import React, {Component} from 'react';
import {Button} from 'antd';

class VideoControls extends Component {
  state = {};

  resetMarkers = () => {
    this.props.broadcastToAllClients({
      markers: [],
    });
  };

  togglePlayback = () => {
    this.props.broadcastToAllClients({
      playing: !this.props.currentContent.playing,
      markers: [],
    });
  };

  render() {
    return (
      <div className="Controls">
        <Button
          type="primary"
          onClick={this.togglePlayback}
          icon={this.props.currentContent.playing ? 'pause' : 'caret-right'}
        />
        {!this.props.currentContent.playing && [
          <Button
            type="primary"
            key="setMarker"
            onClick={this.props.toggleAddingMarker}
            ghost={!this.props.allowAddingMarker}
          >
            Marker setzen
          </Button>,
          <Button
            type="primary"
            key="resetMarkers"
            onClick={this.resetMarkers}
            disabled={this.props.currentContent.markers.length === 0}
          >
            Marker zurücksetzen
          </Button>,
        ]}
      </div>
    );
  }
}

export default VideoControls;
