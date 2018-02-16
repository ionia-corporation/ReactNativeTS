import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { Container, Content } from 'native-base';

import { AppState, DeviceWithData } from '../types/index';
import { Authenticated } from './authenticated';
import { getDevicesWithData } from '../store/blueprint/devices/reducers';
import { getOrganization, getDescendants } from '../store/blueprint/organizations/reducers';
import { Devices, Organizations } from '../lib/xively/models/index';
import { DeviceList as DeviceListShared } from './shared';
import Styles from '../styles/main';
import { HeaderComponent, AddBar } from './index';
import { GroupList as GroupListShared } from './shared';

interface ReduxStateProps {
  group: Organizations.Organization;
  devices: DeviceWithData[];
  subGroups: Organizations.Organization[];
}

interface ReduxDispatchProps {
}

interface GroupProps extends
    React.Props<GroupDevicesScreenComponent>,
    ReduxStateProps,
    ReduxDispatchProps,
    NavigationScreenConfigProps {
}

function mapStateToProps(state: AppState, ownProps: GroupProps) {
  const { groupId } = ownProps.navigation.state.params;
  const group = getOrganization(state, groupId);
  const devices = getDevicesWithData(state, groupId);
  const subGroups = getDescendants(state, groupId);

  return {
    group,
    devices,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: GroupProps) {
  return {
  }
}


export class GroupDevicesScreenComponent extends React.Component<GroupProps> {
  render() {
    const { groupName } = this.props.navigation.state.params;

    return (
      <Container style={Styles.viewContainer}>
        <HeaderComponent
          title={groupName}
          backButton={() => this.props.navigation.goBack()}
          searchButton={true}/>

        <Content>
          <GroupListShared
            groups={this.props.subGroups}
            onPress={(group) => {
              this.props.navigation.navigate('Group', {
                groupId: group.id,
                groupName: group.name || 'no name',
              });
            }}
          />

          <DeviceListShared
            devices={this.props.devices}
            onPress={(device) => {
              this.props.navigation.navigate('Device', {
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

export let GroupDevices = Authenticated(connect(mapStateToProps, mapDispatchToProps)(GroupDevicesScreenComponent));
export default GroupDevices;
