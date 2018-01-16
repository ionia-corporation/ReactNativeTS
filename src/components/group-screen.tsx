import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { AppState, DeviceWithData } from '../types/index';
import { Authenticated } from './authenticated';
import { getOrganization } from '../store/blueprint/organizations/reducers';
import { getDevicesWithData } from '../store/blueprint/devices/reducers';
import { Organizations } from '../lib/xively/models/index';
import { DeviceList } from './shared';

import { View, Text, Button, Image, ScrollView } from "react-native";
import Styles from '../styles/main';

interface ReduxStateProps {
  group: Organizations.Organization;
  devices: DeviceWithData[];
}
interface ReduxDispatchProps {
}
interface GroupProps extends
    React.Props<GroupScreenComponent>,
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

export class GroupScreenComponent extends React.Component<GroupProps, GroupState> {
    static navigationOptions = {
        title: 'Group',
    };

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
    return (
      <View style={Styles.container}>
        <Text>
          {this.props.group.name}
        </Text>
        <DeviceList devices={this.props.devices} onPress={(deviceId) => {
          // TODO: navigate!
          console.log('clicked ' + deviceId);
        }} />
      </View>
    );
  }
}

export let GroupScreen = Authenticated(connect(mapStateToProps, mapDispatchToProps)(GroupScreenComponent));
export default GroupScreen;
