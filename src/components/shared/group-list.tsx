import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { Authenticated } from '../authenticated';
import { Organizations } from '../../lib/xively/models/index';
import { Content, List, ListItem, Text } from 'native-base';

import { ListViewDataSource } from "react-native";
import Styles from '../../styles/main';

interface GroupListProps extends
  React.Props<GroupList> {
  groups: Organizations.Organization[];
  onPress: (group: Organizations.Organization) => void;
}

interface GroupListState {}

export class GroupList extends React.Component<GroupListProps, GroupListState> {
  render() {
    return (
      <List
        enableEmptySections
        dataArray={this.props.groups}
        renderRow={(group: Organizations.Organization) => {
          return (
            <ListItem>
              <Text
                style={Styles.listItemText}
                onPress={() => {
                  this.props.onPress(group);
                }}>
                {group.name}
              </Text>
            </ListItem>
          );
        }
      }/>
    );
  }
}

export default GroupList;
