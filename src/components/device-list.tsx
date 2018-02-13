import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { Container } from 'native-base';

import { AppState, DeviceWithData } from '../types/index';
import { getDevicesWithData } from '../store/blueprint/devices/reducers';
import { TopicData } from '../store/mqtt/reducers';
import { topic } from '../store/mqtt/utils';
import { Devices } from '../lib/xively/models/index';
import { DeviceList as DeviceListShared } from './shared';
import Styles from '../styles/main';
import { HeaderComponent } from './index';
import { Authenticated } from './authenticated';

interface ReduxStateProps {
  devices: DeviceWithData[];
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
  return {
    devices: getDevicesWithData(state),
  }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: DeviceListProps) {
  return {
  }
}

export class DeviceListComponent extends React.Component<DeviceListProps, null> {

  render() {
    return (
      <Container>
        <HeaderComponent title='Devices'/>

        <DeviceListShared
          devices={this.props.devices}
          onPress={(device) => {
            this.props.navigation.navigate('Device', {
              deviceId: device.device.id,
              deviceName: device.device.name || device.device.serialNumber,
            });
          }}
        />
      </Container>
    );
  }
}

export let DeviceList = connect(mapStateToProps, mapDispatchToProps)(DeviceListComponent);
export default DeviceList;
