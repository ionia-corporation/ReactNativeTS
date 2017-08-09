import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../types/index';
import { Authenticated } from './authenticated';
import { getDevices } from '../store/blueprint/devices/reducers';
import { Devices } from '../lib/xively/models/index';

import { View, Text, Button, ListView, ListViewDataSource, Image } from "react-native";
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

interface DeviceListState {
    deviceDataSource: ListViewDataSource;
}

export class DeviceListComponent extends React.Component<DeviceListProps, DeviceListState> {
    static navigationOptions = {
        title: 'Devices',
    };

    constructor() {
        super();
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
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
                <Text style={Styles.title}>
                    Devices ({this.props.devices ? this.props.devices.length : 0})
                </Text>
                <ListView
                    dataSource={this.state.deviceDataSource}
                    renderRow={(device: Devices.Device) =>
                        <View style={Styles.deviceRow}>
                            <Text style={Styles.deviceRowText}>
                                <Image style={Styles.deviceConnectedImage} source={device.connected ?
                                    require('../images/device_on.png') : require('../images/device_off.png')} />
                                {device.name || device.serialNumber || '(no name)'}
                            </Text>
                        </View>
                    } />
            </View>
        );
    }
}

export let DeviceList = Authenticated(connect(mapStateToProps, mapDispatchToProps)(DeviceListComponent));
export default DeviceList;
