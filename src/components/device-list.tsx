import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../types/index';
import { Authenticated } from './authenticated';
import { getDevices } from '../store/blueprint/devices/reducers';
import { Devices } from '../lib/xively/models/index';

import { View, Text, Button } from "react-native";
import Styles from '../styles/main';

interface DeviceListReduxProps {
    devices: Devices.Device[];
}
interface DeviceListDispatchProps {
}
interface DeviceListProps extends
    React.Props<DeviceListComponent>,
    DeviceListReduxProps,
    DeviceListDispatchProps {
}

function mapStateToProps(state: AppState, ownProps: DeviceListProps) {
    return {
        devices: getDevices(state),
    }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: DeviceListProps) {
    return {
    }
}

export class DeviceListComponent extends React.Component<DeviceListProps, void> {
    static navigationOptions = {
        title: 'Devices',
    };
    render() {
        return (
            <View style={Styles.container}>
                <Text style={Styles.title}>
                    Devices
                </Text>
                { this.props.devices ? this.props.devices.map((d) => {
                    return <Text style={Styles.subtitle}>d.name</Text>;
                }) : null }
            </View>
        );
    }
}

export let DeviceList = Authenticated(connect(mapStateToProps, mapDispatchToProps)(DeviceListComponent));
export default DeviceList;
