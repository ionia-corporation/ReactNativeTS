import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { AppState } from '../types/index';
import { Authenticated } from './authenticated';
import { getTopLevelOrganizations } from '../store/blueprint/organizations/reducers';
import { Organizations } from '../lib/xively/models/index';

import { View, Text, Button, ListView, ListViewDataSource, Image } from "react-native";
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

interface GroupListState {
  groupDataSource: ListViewDataSource;
}

export class GroupListComponent extends React.Component<GroupListProps, GroupListState> {
    static navigationOptions = {
        title: 'Groups',
    };

    constructor(prop) {
        super(prop);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return r1 !== r2;
            },
        });
        if (this.props && this.props.groups) {
            ds.cloneWithRows(this.props.groups)
        }
      this.state = {
        groupDataSource: ds,
      };
    }

    componentWillReceiveProps(newProps: GroupListProps) {
        if (newProps.groups) {
            this.setState({
                groupDataSource: this.state.groupDataSource.cloneWithRows(newProps.groups),
            });
        }
    }

    render() {
        return (
            <View style={Styles.container}>
                <ListView
                    enableEmptySections
                    dataSource={this.state.groupDataSource}
                    renderRow={(group: Organizations.Organization) => {
                        return <View style={Styles.groupRow}>
                          <Text style={Styles.groupRowText} onPress={() => {
                                this.props.navigation.navigate('Group', {
                                    groupId: group.id,
                                    groupName: group.name || 'no name',
                                });
                            }}>
                            {group.name}
                          </Text>
                        </View>;
                        }
                    } />
            </View>
        );
    }
}

export let GroupList = Authenticated(connect(mapStateToProps, mapDispatchToProps)(GroupListComponent));
export default GroupList;
