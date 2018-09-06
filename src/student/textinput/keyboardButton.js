import React, { Component } from 'react';
import { View, VrButton, StyleSheet, Text, Animated } from 'react-360';

const styles = StyleSheet.create({
  text: {
    fontSize: 8,
    textAlign: 'center',
    color: '#ffffff',
    opacity: 3,
    fontFamily: 'HelveticaNeue-Light',
    fontWeight: 'normal',
  },
  button: {
    height: 30,
    padding: 10,
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
  },
});
class KeyboardButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: this.props.keyboardColor || '#0d0d0d',
      opacity: 0.5,
      keyboardOnHover: this.props.keyboardOnHover,
      keyboardColor: this.props.keyboardColor,
    };
  }

  handleTheClick() {
    this.setState(
      { backgroundColor: 'white' },
      (() => {
        setTimeout((() => this.test.bind(this))(), 1);
      })(),
    );
    if (this.props.isDisabled === false) {
      this.props.clickHandler(this.props.value);
    }
  }

  test() {
    this.setState({ backgroundColor: this.state.keyboardColor || '#0d0d0d' });
  }

  render() {
    return (
      <VrButton
        onClick={this.handleTheClick.bind(this)}
        style={[
          styles.button,
          {
            backgroundColor:
              this.props.isDisabled === false
                ? this.state.backgroundColor
                : 'red',
          },
          { opacity: this.state.opacity },
        ]}
        onEnter={() =>
          this.setState({
            backgroundColor: this.state.keyboardOnHover || 'green',
          })
        }
        onExit={() =>
          this.setState({
            backgroundColor: this.state.keyboardColor || '#0d0d0d',
          })
        }
      >
        <Text style={styles.text}>{this.props.value}</Text>
      </VrButton>
    );
  }
}

export default KeyboardButton;
