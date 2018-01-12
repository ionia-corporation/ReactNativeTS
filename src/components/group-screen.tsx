import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { AppState } from '../types/index';
import { Authenticated } from './authenticated';
import { getOrganization } from '../store/blueprint/organizations/reducers';
import { Organizations } from '../lib/xively/models/index';

import { View, Text, Button, Image, ScrollView } from "react-native";
import Styles from '../styles/main';

interface ReduxStateProps {
    group: Organizations.Organization;
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
    return {
        group,
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
      )
    }
    return (
      <View style={Styles.container}>
        <Text>
          {this.props.group.name}
        </Text>
      </View>
    );
  }
}

export let GroupScreen = Authenticated(connect(mapStateToProps, mapDispatchToProps)(GroupScreenComponent));
export default GroupScreen;
