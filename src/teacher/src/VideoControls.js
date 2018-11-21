import React, {Component} from 'react';
import {Button, Slider} from 'antd';

class VideoControls extends Component {
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

  onSliderChange = value => {
    this.props.broadcastToAllClients({
      playbackPosition: value,
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
        <Slider
          onChange={this.onSliderChange}
          max={this.props.videoDuration}
          value={this.props.currentContent.playbackPosition}
          step={0.01}
        />
        {this.props.videoDuration}
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
