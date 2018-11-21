import React, {Component} from 'react';
import {Button, Slider, Radio} from 'antd';

class ModelControls extends Component {
  state = {
    sliderMode: 'rotation',
  };

  onSliderChange = value => {
    this.props.broadcastToAllClients({
      [this.state.sliderMode]: value,
    });
  };

  changeSliderMode = e => {
    this.setState({
      sliderMode: e.target.value,
    });
  };

  resetMarkers = () => {
    this.props.broadcastToAllClients({
      markers: [],
    });
  };

  render() {
    const sliderMax = this.state.sliderMode === 'rotation' ? 360 : 10;
    const sliderValue = this.props.currentContent[this.state.sliderMode];

    return (
      <div className="Controls">
        <Radio.Group
          value={this.state.sliderMode}
          onChange={this.changeSliderMode}
          buttonStyle="solid"
        >
          <Radio.Button value="rotation">Drehen</Radio.Button>
          <Radio.Button value="scaleFactor">Skalieren</Radio.Button>
        </Radio.Group>
        <Slider
          max={sliderMax}
          value={sliderValue}
          onChange={this.onSliderChange}
          step={0.01}
          tipFormatter={null}
        />
        <Button type="primary" onClick={this.resetMarkers}>
          Marker zurücksetzen
        </Button>
      </div>
    );
  }
}

export default ModelControls;
