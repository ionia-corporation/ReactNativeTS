import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../store/reducers/index';

import { View, Text, Button } from "react-native";
import Styles from '../styles/main';
import { increment } from '../store/actions/sample';

interface DeviceListReduxProps {
}
interface DeviceListDispatchProps {
    increment: () => any;
}
interface DeviceListProps extends
    React.Props<DeviceListComponent>,
    DeviceListReduxProps,
    DeviceListDispatchProps {
}

function mapStateToProps(state: AppState, ownProps: DeviceListProps) {
    return {
    }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: DeviceListProps) {
    return {
        increment: () => dispatch(increment()),
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
                    Devices (todo)
                </Text>
            </View>
        );
    }
}

export let DeviceList = connect(mapStateToProps, mapDispatchToProps)(DeviceListComponent);
export default DeviceList;
