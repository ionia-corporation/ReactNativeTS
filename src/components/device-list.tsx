import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { AppState, DeviceWithData } from '../types/index';
import { Authenticated } from './authenticated';
import { getDevicesWithData } from '../store/blueprint/devices/reducers';
import { TopicData } from '../store/mqtt/reducers';
import { topic } from '../store/mqtt/utils';
import { Devices } from '../lib/xively/models/index';
import { DeviceList as DeviceListShared } from './shared';

import { View, Text, Button, Image } from "react-native";
import Styles from '../styles/main';

interface ReduxStateProps {
    devices: DeviceWithData[];
}
interface ReduxDispatchProps {
}
interface DeviceListProps extends
    React.Props<DeviceListComponent>,
    ReduxStateProps,
    ReduxDispatchProps,
    NavigationScreenConfigProps {
}

function mapStateToProps(state: AppState, ownProps: DeviceListProps) {
    return {
        devices: getDevicesWithData(state),
    }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: DeviceListProps) {
    return {
    }
}

export class DeviceListComponent extends React.Component<DeviceListProps, null> {
    static navigationOptions = {
        title: 'Devices',
    };

    render() {
        return (
            <View style={Styles.container}>
                <DeviceListShared devices={this.props.devices} onPress={(deviceId) => {
                    const device = this.props.devices.find((d) => d.device.id === deviceId);
                    if (!device) {
                        console.warn('device ID ' + deviceId + ' not found in props!');
                        return;
                    }
                    this.props.navigation.navigate('Device', {
                        deviceId: device.device.id,
                        deviceName: device.device.name || device.device.serialNumber,
                    });
                }}/>
            </View>
        );
    }
}

export let DeviceList = Authenticated(connect(mapStateToProps, mapDispatchToProps)(DeviceListComponent));
export default DeviceList;
