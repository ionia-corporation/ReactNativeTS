import * as React from 'react';
import { Content, List, ListItem, Text } from 'native-base';

import Styles from '../../styles/main';
import { Organizations } from '../../lib/xively/models/index';

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
            <ListItem style={[Styles.listItem, Styles.listItemGroup]}>
              <Text style={Styles.listItemSubtitle}>Group</Text>

              <Text
                numberOfLines={1}
                style={Styles.listItemTitle}
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
