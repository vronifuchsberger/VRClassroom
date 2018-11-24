import React, {Component} from 'react';
import MarkerControls from './MarkerControls';
import {Button, Slider} from 'antd';

class VideoControls extends Component {
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

        <div className="spacer" />

        {!this.props.currentContent.playing && (
          <MarkerControls {...this.props} />
        )}
      </div>
    );
  }
}

export default VideoControls;
