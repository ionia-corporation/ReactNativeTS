import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { AppState } from '../types/index';
import { Authenticated } from './authenticated';
import { getTopLevelOrganizations } from '../store/blueprint/organizations/reducers';
import { Organizations } from '../lib/xively/models/index';
import { GroupList as GroupListShared } from './shared';

import { View } from "react-native";
import Styles from '../styles/main';

interface ReduxStateProps {
    groups: Organizations.Organization[];
}
interface ReduxDispatchProps {
}
interface GroupListProps extends
    React.Props<GroupListComponent>,
    ReduxStateProps,
    ReduxDispatchProps,
    NavigationScreenConfigProps {
}

function mapStateToProps(state: AppState, ownProps: GroupListProps) {
  return {
    groups: getTopLevelOrganizations(state),
  }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: GroupListProps) {
    return {
    }
}

export class GroupListComponent extends React.Component<GroupListProps, null> {
    static navigationOptions = {
        title: 'Groups',
    };

    render() {
        return (
            <View style={Styles.container}>
                <GroupListShared
                    groups={this.props.groups}
                    onPress={(group) => {
                        this.props.navigation.navigate('Group', {
                            groupId: group.id,
                            groupName: group.name || 'no name',
                        });
                    }} />
            </View>
        );
    }
}

export let GroupList = Authenticated(connect(mapStateToProps, mapDispatchToProps)(GroupListComponent));
export default GroupList;
