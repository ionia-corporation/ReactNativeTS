import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { Authenticated } from '../authenticated';
import { Organizations } from '../../lib/xively/models/index';

import { View, Text, Button, ListView, ListViewDataSource, Image } from "react-native";
import Styles from '../../styles/main';

interface GroupListProps extends
  React.Props<GroupList> {
  groups: Organizations.Organization[];
  onPress: (group: Organizations.Organization) => void;
}

interface GroupListState {
  groupDataSource: ListViewDataSource;
}

export class GroupList extends React.Component<GroupListProps, GroupListState> {
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

    componentDidMount() {
        this.setState({
            groupDataSource: this.state.groupDataSource.cloneWithRows(this.props.groups),
        });
    }

    render() {
      return (
        <ListView
          enableEmptySections
          dataSource={this.state.groupDataSource}
          renderRow={(group: Organizations.Organization) => {
            return <View style={Styles.groupRow}>
              <Text style={Styles.groupRowText} onPress={() => {
                this.props.onPress(group);
              }}>
                {group.name}
              </Text>
            </View>;
          }
          } />
      );
    }
}

export default GroupList;
