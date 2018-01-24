import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { AppState, DeviceWithData } from '../types/index';
import { Authenticated } from './authenticated';
import { getOrganization, getDescendants } from '../store/blueprint/organizations/reducers';
import { getDevicesWithData } from '../store/blueprint/devices/reducers';
import { Organizations } from '../lib/xively/models/index';
import { DeviceList, GroupList } from './shared';

import { View, Text, Button, Image, ScrollView } from "react-native";
import Styles from '../styles/main';

interface ReduxStateProps {
  group: Organizations.Organization;
  devices: DeviceWithData[];
}

interface ReduxDispatchProps {
}

interface GroupProps extends
    React.Props<GroupDevicesScreenComponent>,
    ReduxStateProps,
    ReduxDispatchProps,
    NavigationScreenConfigProps {
}

function mapStateToProps(state: AppState, ownProps: GroupProps) {
  const group = getOrganization(state, ownProps.navigation.state.params.groupId);
  const devices = getDevicesWithData(state, ownProps.navigation.state.params.groupId);
    return {
      group,
      devices,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: GroupProps) {
    return {
    }
}

interface GroupState {
}

export class GroupDevicesScreenComponent extends React.Component<GroupProps, GroupState> {
  render() {
    if (!this.props || !this.props.group) {
      return (
        <View style={Styles.container}>
          <Text style={Styles.title}>
            loading
          </Text>
        </View>
      );
    }

    let devices = <Text>(none)</Text>;

    if (this.props.devices && this.props.devices.length) {
      devices = <DeviceList devices={this.props.devices} onPress={(device) => {
        this.props.navigation.navigate('Device', {
            deviceId: device.device.id,
            deviceName: device.device.name || device.device.serialNumber,
        });
    }} />;
    }

    return (
      <View style={Styles.container}>
        <View>
          {devices}
        </View>
      </View>
    );
  }
}

export let GroupDevices = Authenticated(connect(mapStateToProps, mapDispatchToProps)(GroupDevicesScreenComponent));
export default GroupDevices;
