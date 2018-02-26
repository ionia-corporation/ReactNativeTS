import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
// import { View, Text, Button, ListView, ListViewDataSource, Image } from "react-native";
import { ListView, ListViewDataSource, Image } from "react-native";
import { Content, List, ListItem, Text } from 'native-base';

import { AppState, DeviceWithData } from '../../types/index';
import { getDevices } from '../../store/blueprint/devices/reducers';
import { TopicData } from '../../store/mqtt/reducers';
import { topic } from '../../store/mqtt/utils';
import { Devices } from '../../lib/xively/models/index';
import Styles from '../../styles/main';

interface DeviceListProps extends
  React.Props<DeviceList> {
  onPress: (device: DeviceWithData) => void;
  devices: DeviceWithData[];
}

interface DeviceListState {
  deviceDataSource: ListViewDataSource;
}

export class DeviceList extends React.Component<DeviceListProps, DeviceListState> {
  connectedImage = require('../../../images/device_on.png');
  disconnectedImage = require('../../../images/device_off.png');

  render() {
    return (
      <Content>
        <List
          enableEmptySections
          dataArray={this.props.devices}
          renderRow={(deviceWithData: DeviceWithData) => {
            const curMessage = deviceWithData.mqttData['_updates/fields'];
            const device = deviceWithData.device;
            const curData = curMessage && curMessage.message ? curMessage.message.parsedPayload : null;
            const connected = curData ? curData.state.connected : false;

            return (
              <ListItem>
                <Image
                  style={Styles.deviceConnectedImage}
                  source={connected ? this.connectedImage : this.disconnectedImage}
                />

                <Text style={Styles.listItemText} onPress={() => {
                  this.props.onPress(deviceWithData);
                }}>
                  {device.name || device.serialNumber || '(no name)'} {curData ? curData.state.firmwareVersion : ''}
                </Text>
              </ListItem>
            );
            }
          }
        />
      </Content>
    );
  }
}

export default DeviceList;
