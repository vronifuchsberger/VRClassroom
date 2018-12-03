import React, {Component} from 'react';

class MarkerControls extends Component {
  resetMarkers = () => {
    this.props.broadcastToAllClients({
      markers: [],
    });
  };

  render() {
    return (
      <div className="MarkerControls">
        <button
          onClick={this.props.toggleAddingMarker}
          className={this.props.allowAddingMarker ? 'active' : ''}
          disabled={this.props.disabled}
        >
          Marker setzen
        </button>
        <button
          onClick={this.resetMarkers}
          disabled={
            this.props.currentContent.markers.length === 0 ||
            this.props.disabled
          }
        >
          Marker zurücksetzen
        </button>
      </div>
    );
  }
}

export default MarkerControls;
