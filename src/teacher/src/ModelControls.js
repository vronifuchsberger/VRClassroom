import React, {Component} from 'react';
import {Slider, Radio} from 'antd';
import MarkerControls from './MarkerControls';

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
      sliderMode: e,
    });
  };

  render() {
    const sliderMax = this.state.sliderMode === 'rotation' ? 360 : 10;
    const sliderValue = this.props.currentContent[this.state.sliderMode];

    return (
      <div className="Controls">
        <button
          onClick={() => this.changeSliderMode('rotation')}
          className={
            this.state.sliderMode === 'rotation' ? 'active left' : 'left'
          }
        >
          Drehen
        </button>
        <button
          onClick={() => this.changeSliderMode('scaleFactor')}
          className={
            this.state.sliderMode === 'scaleFactor' ? 'active left' : 'left'
          }
        >
          Skalieren
        </button>
        <div className="spacing">
          <Slider
            max={sliderMax}
            value={sliderValue}
            onChange={this.onSliderChange}
            step={0.01}
            tipFormatter={null}
          />
        </div>

        <MarkerControls {...this.props} />
      </div>
    );
  }
}

export default ModelControls;
