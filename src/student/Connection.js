import {AsyncStorage, NativeModules} from 'react-360';
import {updateStore, getState} from './Store';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

export default class Connection {
  constructor(props) {
    this.props = props;
    this.connectWS(props.hostname);

    RCTDeviceEventEmitter.addListener('markerAdded', e => {
      if (this.ws) {
        if (e.didHitModel) {
          const store = getState();
          let [x, y, z] = e.position;

          // location offset from Model's location set in client.js
          y += 70;
          z += 150;

          // apply inverse scaling
          x /= store.scaleFactor;
          y /= store.scaleFactor;
          z /= store.scaleFactor;

          // rotate against current rotation
          const t = store.rotation * (Math.PI / 180);
          const newX = x * Math.cos(t) - z * Math.sin(t);
          const newZ = x * Math.sin(t) + z * Math.cos(t);

          e.position = [newX, y, newZ];
        }

        this.ws.send(
          JSON.stringify({
            markerAdded: e,
          }),
        );
      }
    });

    if (NativeModules.HostnameModule.isTeacher) {
      RCTDeviceEventEmitter.addListener('onVideoStatusChanged', e => {
        if (this.ws) {
          this.ws.send(
            JSON.stringify({
              videoStatus: e,
            }),
          );
        }
      });
    }
  }

  sendClientInfo = async () => {
    const clientName = NativeModules.HostnameModule.isTeacher
      ? 'Teacher App'
      : await AsyncStorage.getItem('username');
    let id = await AsyncStorage.getItem('id');

    if (!id) {
      id = Math.random().toString(36);
      AsyncStorage.setItem('id', id);
    }
    // generate ID if not existent
    this.ws.send(
      JSON.stringify({
        clientName: clientName,
        id: id,
      }),
    );
    if (!clientName) {
      setTimeout(() => this.askClientName(), 100);
    }
  };

  connectWS = hostname => {
    this.ws = new WebSocket(`ws://${hostname}:8888/`);
    this.ws.onopen = () => {
      this.sendClientInfo();
      if (this.reconnecter) {
        clearInterval(this.reconnecter);
        this.reconnecter = null;
      }
    };
    this.ws.onmessage = e => {
      // a message was received
      try {
        const data = JSON.parse(e.data || '{}');
        updateStore(data);
      } catch (error) {
        console.error(e, error);
      }
    };

    this.ws.onclose = () => {
      if (!this.reconnecter) {
        this.reconnecter = setInterval(
          () => this.connectWS(this.props.hostname),
          1000,
        );
      }
    };
  };

  async askClientName() {
    const input = await NativeModules.Keyboard.startInput({
      placeholder: 'Enter your name',
    });

    try {
      await AsyncStorage.setItem('username', input);
    } catch (error) {
      console.error(error);
    }

    this.sendClientInfo();
  }
}
