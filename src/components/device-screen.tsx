import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { AppState, DeviceWithData } from '../types/index';
import { Authenticated } from './authenticated';
import { getDevice } from '../store/blueprint/devices/reducers';
import { TopicData } from '../store/mqtt/reducers';
import { topic } from '../store/mqtt/utils';
import { Devices } from '../lib/xively/models/index';

import { View, Text, Button, Image } from "react-native";
import Styles from '../styles/main';

interface ReduxStateProps {
    device: DeviceWithData;
}
interface ReduxDispatchProps {
}
interface DeviceProps extends
    React.Props<DeviceScreenComponent>,
    ReduxStateProps,
    ReduxDispatchProps,
    NavigationScreenConfigProps {
}

function mapStateToProps(state: AppState, ownProps: DeviceProps) {
    const device: Devices.Device = getDevice(state, ownProps.navigation.state.params.deviceId);
    let mqttData: { [topicName: string]: TopicData } = {};
    Object.keys(state.mqtt.data).filter((topic) => {
        return topic.split('/')[5] === device.id;
    }).forEach((topic) => {
        mqttData[topic.split('/').slice(6).join('/')] = state.mqtt.data[topic];
    });
    return {
        device:
        { device, mqttData }
    };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: DeviceProps) {
    return {
    }
}

interface DeviceState {
}

export class DeviceScreenComponent extends React.Component<DeviceProps, DeviceState> {
    connectedImage = require('../../images/device_on.png');
    disconnectedImage = require('../../images/device_off.png');
    static navigationOptions = {
        title: 'Device',
    };

    render() {
        if (!this.props || !this.props.device || !this.props.device.device) {
            return (
                <View style={Styles.container}>
                    <Text style={Styles.title}>
                        loading
                    </Text>
                </View>
            )
    }
        return (
            <View style={Styles.container}>
                <Text style={Styles.title}>
                    {this.props.device.device.name}
                </Text>
                <Text>
                    {this.props.device?JSON.stringify(this.props.device.mqttData):'(no data)'}
                </Text>
            </View>
        );
    }
}

export let DeviceScreen = Authenticated(connect(mapStateToProps, mapDispatchToProps)(DeviceScreenComponent));
export default DeviceScreen;
