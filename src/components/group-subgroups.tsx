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
}

interface ReduxDispatchProps {
}

interface GroupProps extends
    React.Props<SubGroupsScreenComponent>,
    ReduxStateProps,
    ReduxDispatchProps,
    NavigationScreenConfigProps {
}

function mapStateToProps(state: AppState, ownProps: GroupProps) {
  const group = getOrganization(state, ownProps.navigation.state.params.groupId);
  const subGroups = getDescendants(state, ownProps.navigation.state.params.groupId);
    return {
      group,
      subGroups,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: GroupProps) {
    return {
    }
}

interface GroupState {
}

export class SubGroupsScreenComponent extends React.Component<GroupProps, GroupState> {
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

    return (
      <View style={Styles.container}>
        <View>
          <Text style={Styles.groupPageSubtitle}>
          </Text>
          {subGroups}
        </View>
      </View>
    );
  }
}

export let SubGroupsScreen = Authenticated(connect(mapStateToProps, mapDispatchToProps)(SubGroupsScreenComponent));
export default SubGroupsScreen;