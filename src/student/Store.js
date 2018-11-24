import * as React from 'react';

const Store = {};

const listeners = new Set();

function updateComponents() {
  for (const cb of listeners.values()) {
    cb();
  }
}
export function updateStore(data) {
  Store = {...Store, ...data};
  updateComponents();
}

export function getState() {
  return Store;
}

export function connect(Component) {
  return class Wrapper extends React.Component {
    state = Store;

    _listener = () => {
      this.setState(Store);
    };

    componentDidMount() {
      listeners.add(this._listener);
    }

    componentWillUnmount() {
      listeners.delete(this._listener);
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  };
}
