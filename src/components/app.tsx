import * as React from 'react';
import { Text } from 'react-native';
import { connect, Dispatch } from 'react-redux';
import { Container, Content, Title } from 'native-base';
import { values } from 'lodash';
import { NavigationScreenConfigProps, NavigationParams, NavigationInitAction } from 'react-navigation';

import { Device, AppState } from '../types/index';
import xively from '../lib/xively';
import { batchRequest } from '../store/blueprint/actions';
import { fetchProfile } from '../store/profile/actions';
import { actions as mqttActions } from '../store/mqtt';
import Styles from '../styles/main';
import { createRootNavigator } from '../index.ios';

interface OwnProps {
  // Setting children resolves an error with extending ReactRouter and React.props
  children?: React.ReactElement<any>;
}

interface ReduxStateProps {
  loading: boolean;
  devices: Array<Device>;
  loadedOnce: boolean;
  // error: string;
}

function mapStateToProps(state: AppState, ownProps: OwnProps): ReduxStateProps {
  return {
    loading: state.blueprint.devices.loading || state.blueprint.organizations.loading || state.profile.loading,
    devices: values(state.blueprint.devices.data),
    loadedOnce: state.blueprint.devices.loadedOnce,
    // error: state.batchReq.error,
  };
}

interface ReduxDispatchProps {
  fetch: any;
  fetchProfile: any;
  connectToMqtt: any;
  subscribeDevices: any;
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: OwnProps): ReduxDispatchProps {
  return {
    fetch: () => dispatch(batchRequest()),
    fetchProfile: () => dispatch(fetchProfile()),
    connectToMqtt: () => dispatch(mqttActions.connect()),
    subscribeDevices: (devices: Array<Device>) => devices.forEach((device: Device) => dispatch(mqttActions.subscribeDevice(device))),
  };
}

interface AuthenticatedProps extends
  NavigationScreenConfigProps,
  OwnProps,
  ReduxStateProps,
  ReduxDispatchProps { }

interface AuthenticatedState {
  isAuthenticated: boolean;
}

class AppComponent extends React.Component<AuthenticatedProps, AuthenticatedState> {
  subscribed = false;
  checkingAuth = false;

  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
    };
  }

  componentDidMount() {
    this.checkAuth();
    // Only run the initial fetch once
    if (this.props.loadedOnce && this.props.devices.length > 0) {
      return;
    }
    this.props.fetch();
    this.props.fetchProfile();
    this.props.connectToMqtt();
  }

  // Runs before new props
  // This happens while navigating to different pages on the app
  // TODO: Is this the source of our rerendering problems!?
  componentWillReceiveProps(nextProps) {
    this.checkAuth();
    if (!this.subscribed && this.props.devices.length > 0) {
      // make sure this runs only once
      this.props.subscribeDevices(this.props.devices);
      this.subscribed = true;
    }
  }

  async checkAuth() {
    if (this.checkingAuth) {
      return;
    }

    this.checkingAuth = true;
    try {
      const isAuthenticated = await xively.comm.checkJwt();
      this.setState({ isAuthenticated });
    } catch (e) {
      console.warn('ERROR checking auth: ' + e.message);
      this.setState({ isAuthenticated: false })
      return;
    } finally {
      this.checkingAuth = false;
    }
  }

  render() {
    const { isAuthenticated } = this.state;
    const Layout = createRootNavigator(isAuthenticated)
    return <Layout />;
  }
}

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);
