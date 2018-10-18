import {AsyncStorage, NativeModules, Environment} from 'react-360';

export default class Connection {
  constructor(props) {
    this.connectWS(props.hostname);
    Environment.setBackgroundImage('static_assets/360_world.jpg');
  }

  sendClientInfo = async () => {
    const clientName = await AsyncStorage.getItem('username');
    let id = await AsyncStorage.getItem('id');

    if (!id) {
      id = Math.random().toString(36);
      AsyncStorage.setItem('id', id);
    }
    // generate ID if not exisitent
    this.ws.send(JSON.stringify({clientName: clientName, id: id}));
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
      }
    };
    this.ws.onmessage = e => {
      // a message was received
      const data = JSON.parse(e.data);

      /*if (data.url != '' && data.mediatype === 'photo') {
        this.setState({greeting: data.url});
        Environment.setBackgroundImage(data.url);
        this.setState({showContent: true});
      } else if (data.url != '' && data.mediatype === 'video') {
        this.setState({showContent: true});
        VideoModule.createPlayer('myplayer');
        VideoModule.play('myplayer', {
          source: {url: data.url}, // provide the path to the video
        });
        Environment.setBackgroundVideo('myplayer');
      } else {
        this.setState({showContent: false});
      } */
    };

    this.ws.onclose = () => {
      this.reconnecter = setInterval(
        () => this.connectWS(this.props.hostname),
        1000,
      );
    };
  };

  async askClientName() {
    const input = await NativeModules.Keyboard.startInput({
      placeholder: 'Enter your name',
    });

    try {
      await AsyncStorage.setItem('username', input);
    } catch (error) {
      console.log(error);
    }

    this.sendClientInfo();
  }
}
