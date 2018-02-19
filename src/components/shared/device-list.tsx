import * as React from 'react';
import { Content, List, ListItem, Text } from 'native-base';

import { DeviceWithData } from '../../types/index';
import Styles from '../../styles/main';

interface DeviceListProps extends
  React.Props<DeviceList> {
  onPress: (device: DeviceWithData) => void;
  devices: DeviceWithData[];
}

interface DeviceListState {}

export class DeviceList extends React.Component<DeviceListProps, DeviceListState> {
  render() {
    return (
      <List
        enableEmptySections
        dataArray={this.props.devices}
        renderRow={(deviceWithData: DeviceWithData) => {
          const curMessage = deviceWithData.mqttData['_updates/fields'];
          const device = deviceWithData.device;
          const curData = curMessage && curMessage.message ? curMessage.message.parsedPayload : null;
          const connected = curData ? curData.state.connected : false;

          return (
            <ListItem
              style={Styles.listItem}
              onPress={() => {
                this.props.onPress(deviceWithData);
              }}>
              
              <Text style={[Styles.listItemStatus, connected && Styles.listItemStatusOn]}>
                {connected ? 'On' : 'Off'}
              </Text>

              <Text
                numberOfLines={1}
                style={Styles.listItemTitle}>
                {device.name || device.serialNumber || '(no name)'} {curData ? curData.state.firmwareVersion : ''}
              </Text>
            </ListItem>
          );
          }
        }
      />
    );
  }
}

export default DeviceList;
