import * as React from 'react';

const State = {
  posts: undefined,
  current: -1,
};

const listeners = new Set();

function updateComponents() {
  for (const cb of listeners.values()) {
    cb();
  }
}
export function setCurrent(value) {
  State.current = value;
  updateComponents();
}

export function connect(Component) {
  return class Wrapper extends React.Component {
    state = {
      posts: State.posts,
      current: State.current,
    };

    _listener = () => {
      this.setState({
        posts: State.posts,
        current: State.current,
      });
    };

    componentDidMount() {
      listeners.add(this._listener);
    }

    componentWillUnmount() {
      listeners.delete(this._listener);
    }

    render() {
      return (
        <Component
          {...this.props}
          posts={this.state.posts}
          current={this.state.current}
        />
      );
    }
  };
}
