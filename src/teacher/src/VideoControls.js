import React, {Component} from 'react';
import {Button, Slider} from 'antd';

class VideoControls extends Component {
  state = {
    duration: -1,
  };

  componentDidMount() {
    this.getVideoDuration();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentContent.url !== this.props.currentContent.url) {
      this.getVideoDuration();
    }
  }

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

  getVideoDuration = () => {
    const video = document.createElement('video');
    video.autoplay = false;
    video.addEventListener('durationchange', e => {
      console.log(e);
      this.setState({
        duration: e.target.duration,
      });
    });
    video.preload = 'metadata';
    video.src = this.props.currentContent.url;
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
          max={this.state.duration}
          value={this.props.currentContent.playbackPosition}
          step={0.01}
        />
        {this.state.duration}
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
