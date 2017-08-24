import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../types/index';
import { Authenticated } from './authenticated';
import { getDevices } from '../store/blueprint/devices/reducers';
import { TopicData } from '../store/mqtt/reducers';
import { topic } from '../store/mqtt/utils';
import { Devices } from '../lib/xively/models/index';

import { View, Text, Button, ListView, ListViewDataSource, Image } from "react-native";
import Styles from '../styles/main';

interface DeviceWithData {
    device: Devices.Device;
    mqttData: {
        [topicName: string]: TopicData
    }
};
interface ReduxStateProps {
    devices: DeviceWithData[];
}
interface ReduxDispatchProps {
}
interface DeviceListProps extends
    React.Props<DeviceListComponent>,
    ReduxStateProps,
    ReduxDispatchProps {
}

function mapStateToProps(state: AppState, ownProps: DeviceListProps) {
    const devicesRaw: Devices.Device[] = getDevices(state);
    const devices = devicesRaw.map((device) => {
        let mqttData: { [topicName: string]: TopicData } = {};
        Object.keys(state.mqtt.data).filter((topic) => {
            return topic.split('/')[5] === device.id;
        }).forEach((topic) => {
            mqttData[topic.split('/').slice(6).join('/')] = state.mqtt.data[topic];
        });
        return { device, mqttData };
    });
    return {
        devices
    };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: DeviceListProps) {
    return {
    }
}

interface DeviceListState {
    deviceDataSource: ListViewDataSource;
}

export class DeviceListComponent extends React.Component<DeviceListProps, DeviceListState> {
    connectedImage = require('../../images/device_on.png');
    disconnectedImage = require('../../images/device_off.png');
    static navigationOptions = {
        title: 'Devices',
    };

    constructor() {
        super();
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

    render() {
        return (
            <View style={Styles.container}>
                {/* <Text style={Styles.title}>
                    Devices ({this.props.devices ? this.props.devices.length : 0})
                </Text> */}
                <ListView
                    dataSource={this.state.deviceDataSource}
                    renderRow={(deviceWithData: DeviceWithData) => {
                        const curMessage = deviceWithData.mqttData['_updates/fields'];
                        const device = deviceWithData.device;
                        const curData = curMessage && curMessage.message ? curMessage.message.parsedPayload : null;
                        const connected = curData ? curData.state.connected : false;
                        return <View style={Styles.deviceRow}>
                            <Text style={Styles.deviceRowText}>
                                <Image style={Styles.deviceConnectedImage} source={ connected ?
                                    this.connectedImage : this.disconnectedImage } />
                                {device.name || device.serialNumber || '(no name)'} { curData ? curData.state.firmwareVersion : '' }
                            </Text>
                        </View>;
                        }
                    } />
            </View>
        );
    }
}

export let DeviceList = Authenticated(connect(mapStateToProps, mapDispatchToProps)(DeviceListComponent));
export default DeviceList;
