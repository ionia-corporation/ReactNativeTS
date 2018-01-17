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
  subGroups: Organizations.Organization[];
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
  const subGroups = getDescendants(state, ownProps.navigation.state.params.groupId);
  const devices = getDevicesWithData(state, ownProps.navigation.state.params.groupId);
    return {
      group,
      subGroups,
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

    let subGroups = <Text>(none)</Text>;
    if (this.props.subGroups && this.props.subGroups.length) {
      subGroups = <View>
        <GroupList
          groups={this.props.subGroups}
          onPress={(group) => {
            this.props.navigation.navigate('Group', {
              groupId: group.id,
              groupName: group.name || 'no name',
            });
          }} />
      </View>;
    }
    let devices = <Text>(none)</Text>;
    if (this.props.devices && this.props.devices.length) {
      devices = <DeviceList devices={this.props.devices} onPress={(device) => {
        // TODO: navigate!
        console.log('clicked ' + device.device.id);
      }} />;
    }

    return (
      <View style={Styles.container}>
        <View>
          <Text style={Styles.groupPageSubtitle}>
            Devices
          </Text>
          {devices}
        </View>
        <View>
          <Text style={Styles.groupPageSubtitle}>
            Sub Groups
          </Text>
          {subGroups}
        </View>
      </View>
    );
  }
}

export let GroupScreen = Authenticated(connect(mapStateToProps, mapDispatchToProps)(GroupScreenComponent));
export default GroupScreen;
