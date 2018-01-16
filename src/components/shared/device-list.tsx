import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState, DeviceWithData } from '../../types/index';
import { Authenticated } from '../authenticated';
import { getDevices } from '../../store/blueprint/devices/reducers';
import { TopicData } from '../../store/mqtt/reducers';
import { topic } from '../../store/mqtt/utils';
import { Devices } from '../../lib/xively/models/index';

import { View, Text, Button, ListView, ListViewDataSource, Image } from "react-native";
import Styles from '../../styles/main';

interface DeviceListProps extends
    React.Props<DeviceList> {
    onPress: (deviceId: string) => void;
    devices: DeviceWithData[];
}

interface DeviceListState {
    deviceDataSource: ListViewDataSource;
}

export class DeviceList extends React.Component<DeviceListProps, DeviceListState> {
    connectedImage = require('../../../images/device_on.png');
    disconnectedImage = require('../../../images/device_off.png');

    constructor(prop) {
        super(prop);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return r1 !== r2;
            },
        });
        if (this.props && this.props.devices) {
            ds.cloneWithRows(this.props.devices)
        }
        this.state = {
            deviceDataSource: ds,
        };
    }

    componentWillReceiveProps(newProps: DeviceListProps) {
        if (newProps.devices) {
            this.setState({
                deviceDataSource: this.state.deviceDataSource.cloneWithRows(newProps.devices),
            });
        }
    }

    componentDidMount() {
        this.setState({
            deviceDataSource: this.state.deviceDataSource.cloneWithRows(this.props.devices),
        });
    }

    render() {
      return (
        <ListView
          enableEmptySections
          dataSource={this.state.deviceDataSource}
          renderRow={(deviceWithData: DeviceWithData) => {
            const curMessage = deviceWithData.mqttData['_updates/fields'];
            const device = deviceWithData.device;
            const curData = curMessage && curMessage.message ? curMessage.message.parsedPayload : null;
            const connected = curData ? curData.state.connected : false;
            return <View style={Styles.deviceRow}>
              <Text style={Styles.deviceRowText} onPress={() => {
                this.props.onPress(device.id);
              }}>
                <Image style={Styles.deviceConnectedImage} source={connected ?
                  this.connectedImage : this.disconnectedImage} />
                {device.name || device.serialNumber || '(no name)'} {curData ? curData.state.firmwareVersion : ''}
              </Text>
            </View>;
          }
          } />
      );
    }
}

export default DeviceList;
