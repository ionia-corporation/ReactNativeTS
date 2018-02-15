import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { Container, Content } from 'native-base';

import { AppState, DeviceWithData } from '../types/index';
import { Authenticated } from './authenticated';
import { getDevicesWithData } from '../store/blueprint/devices/reducers';
import { getTopLevelOrganizations } from '../store/blueprint/organizations/reducers';
import { TopicData } from '../store/mqtt/reducers';
import { topic } from '../store/mqtt/utils';
import { Devices, Organizations } from '../lib/xively/models/index';
import { DeviceList as DeviceListShared } from './shared';
import Styles from '../styles/main';
import { HeaderComponent } from './index';
import { GroupList as GroupListShared } from './shared';

interface ReduxStateProps {
  devices: DeviceWithData[];
  groups: Organizations.Organization[];
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
  const devices = getDevicesWithData(state).filter((d) => !d.device.organizationId);
  const groups = getTopLevelOrganizations(state);

  return {
    devices,
    groups,
  }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: DeviceListProps) {
  return {
  }
}

export class DeviceListComponent extends React.Component<DeviceListProps, null> {
  render() {
    return (
      <Container style={Styles.viewContainer}>
        <HeaderComponent title='Devices'/>

        <Content>
          <GroupListShared
            groups={this.props.groups}
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

export let DeviceList = Authenticated(connect(mapStateToProps, mapDispatchToProps)(DeviceListComponent));
export default DeviceList;
