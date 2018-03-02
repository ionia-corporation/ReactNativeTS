import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { Container, Content } from 'native-base';
import { get } from 'lodash';

import { AppState, DeviceWithData } from '../types/index';
import { getDevicesWithData } from '../store/blueprint/devices/reducers';
import { getTopLevelOrganizations, getDescendants, getOrganization } from '../store/blueprint/organizations/reducers';
import { Devices, Organizations } from '../lib/xively/models/index';
import { DeviceList as DeviceListShared } from './shared';
import Styles from '../styles/main';
import { HeaderComponent, AddBar } from './index';
import { GroupList as GroupListShared } from './shared';

interface ReduxStateProps {
  devices: DeviceWithData[];
  groups: Organizations.Organization[];
  groupId: string;
  stackGroupsId: string[];
  group: Organizations.Organization;
}

interface ReduxDispatchProps {
}

interface DeviceListProps extends
  React.Props<DeviceListComponent>,
  ReduxStateProps,
  ReduxDispatchProps,
  NavigationScreenConfigProps {
}

function mapStateToProps(state: AppState, ownProps: DeviceListProps) {
  const groupId = get(ownProps, 'navigation.state.params.groupId', null);
  const stackGroupsId = get(ownProps, 'navigation.state.params.stackGroupsId', []);

  let devices;
  let groups;
  let group;

  if (!groupId) {
    devices = getDevicesWithData(state).filter((d) => !d.device.organizationId);
    groups = getTopLevelOrganizations(state);
  } else {
    devices = getDevicesWithData(state, groupId);
    groups = getDescendants(state, groupId);
    group = getOrganization(state, groupId);
  }

  return {
    devices,
    groups,
    groupId,
    stackGroupsId,
    group
  }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: DeviceListProps) {
  return {
  }
}

export class DeviceListComponent extends React.Component<DeviceListProps, null> {
  render() {
    const { groupId, navigation, groups, devices, stackGroupsId, group } = this.props;

    return (
      <Container style={Styles.viewContainer}>
        <HeaderComponent
          title={get(group, 'name', 'All Devices')}
          backButton={
            groupId
            ? () => navigation.navigate('Devices', { groupId: stackGroupsId.pop(), stackGroupsId })
            : null
          }
          searchButton={true}
        />

        <Content>
          <AddBar/>

          <GroupListShared
            groups={groups}
            onPress={(group) => {
              if (groupId) {
                stackGroupsId.push(groupId);
              }

              navigation.navigate('Devices', {
                groupId: group.id,
                stackGroupsId: stackGroupsId
              });
            }}
          />

          <DeviceListShared
            devices={devices}
            onPress={(device) => {
              navigation.navigate('Device', {
                deviceId: device.device.id,
                deviceName: device.device.name || device.device.serialNumber,
              });
            }}
          />
        </Content>
      </Container>
    );
  }
}

export let DeviceList = connect(mapStateToProps, mapDispatchToProps)(DeviceListComponent);
export default DeviceList;
