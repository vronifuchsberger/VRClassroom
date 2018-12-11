import React, {Component} from 'react';
import {List, Badge, Layout} from 'antd';
import './Sidebar.css';

const {Sider} = Layout;

class Sidebar extends Component {
  getDeviceName = client => {
    if (client.clientName) {
      return client.clientName;
    } else if (client.userAgent.indexOf('OculusBrowser') > -1) {
      return 'Oculus Device';
    } else if (client.userAgent.indexOf('iPhone') > -1) {
      return 'iPhone';
    } else if (client.userAgent.indexOf('Electron') > -1) {
      return 'Teacher App';
    } else if (client.userAgent.indexOf('Chrome') > -1) {
      return 'Chrome';
    } else {
      return 'Unknown device';
    }
  };

  render() {
    return (
      <Sider theme="light">
        <List
          header="Verbundene Geräte:"
          locale={{emptyText: 'keine verbundenen Geräte'}}
          dataSource={Object.values(this.props.connectedClients)}
          size="small"
          renderItem={(client, i) => (
            <List.Item key={i}>
              <Badge status={client.client ? 'success' : 'error'} />
              {this.getDeviceName(client)}
            </List.Item>
          )}
        />
      </Sider>
    );
  }
}

export default Sidebar;
