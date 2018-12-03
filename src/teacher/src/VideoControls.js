import React, {Component} from 'react';
import MarkerControls from './MarkerControls';
import {Icon, Slider} from 'antd';

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

  formatTime(time) {
    time = Math.round(time);
    const seconds = '0' + (time % 60);
    const minutes = Math.floor(time / 60);
    return `${minutes}:${seconds.substr(-2)}`;
  }

  render() {
    return (
      <div className="Controls">
        <button onClick={this.togglePlayback} className="left">
          <Icon
            type={this.props.currentContent.playing ? 'pause' : 'caret-right'}
          />
        </button>
        <div className="time">
          {this.formatTime(this.props.currentContent.playbackPosition)}
        </div>

        <Slider
          onChange={this.onSliderChange}
          max={this.props.videoDuration}
          value={this.props.currentContent.playbackPosition}
          step={0.01}
          tipFormatter={this.formatTime}
        />
        <div className="time">{this.formatTime(this.props.videoDuration)}</div>

        <MarkerControls
          {...this.props}
          disabled={this.props.currentContent.playing}
        />
      </div>
    );
  }
}

export default VideoControls;
