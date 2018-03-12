import * as React from 'react';
import { Image } from 'react-native';
import { connect, Dispatch } from 'react-redux';
import { Container, Content, Title, View } from 'native-base';
import { values } from 'lodash';
import { NavigationScreenConfigProps, NavigationParams, NavigationInitAction } from 'react-navigation';

import { Device, AppState } from '../types/index';
import xively from '../lib/xively';
import { batchRequest } from '../store/blueprint/actions';
import { fetchProfile } from '../store/profile/actions';
import { actions as mqttActions } from '../store/mqtt';
import { checkAuthentication } from '../store/auth/actions';
import Styles from '../styles/main';
import { isEqual } from 'lodash';


interface ReduxStateProps {
  loadingData: boolean;
  devices: Array<Device>;
  loadedOnce: boolean;
  isAuthenticated: boolean;
}

interface ReduxDispatchProps {
  fetch: any;
  fetchProfile: any;
  connectToMqtt: any;
  subscribeDevices: any;
  checkAuthentication: any;
}

interface OwnProps {
  createRootNavigator: Function
}
interface Props extends
  React.Props<AppComponent>,
  ReduxStateProps,
  OwnProps,
  ReduxDispatchProps { }

function mapStateToProps(state: AppState) {
  const { blueprint, profile, auth } = state
  const { devices, organizations } = blueprint;

  return {
    loadingData: devices.loading || organizations.loading || profile.loading,
    devices: values(devices.data),
    loadedOnce: devices.loadedOnce,
    isAuthenticated: auth.isAuthenticated
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: OwnProps) {
  return {
    fetch: () => dispatch(batchRequest()),
    fetchProfile: () => dispatch(fetchProfile()),
    connectToMqtt: () => dispatch(mqttActions.connect()),
    subscribeDevices: (devices: Array<Device>) => devices.forEach((device: Device) => dispatch(mqttActions.subscribeDevice(device))),
    checkAuthentication: () => dispatch(checkAuthentication())
  };
}

interface State {
  subscribed: boolean;
  authChecked: boolean;
}

class AppComponent extends React.Component<Props, State> {
  state = {
    subscribed: false,
    authChecked: false
  }

  async componentDidMount() {
    await this.props.checkAuthentication();
    this.setState({authChecked: true});
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { devices, isAuthenticated, loadingData, loadedOnce } = this.props;

    if (
      !isEqual(devices, nextProps.devices) ||
      isAuthenticated !== nextProps.isAuthenticated ||
      loadingData !== nextProps.loadingData ||
      loadedOnce !== nextProps.loadedOnce ||
      this.state.authChecked !== nextState.authChecked
     ) {
       return true;
     }
     
     return false;
  }

  // Runs before new props
  // This happens while navigating to different pages on the app
  // TODO: Is this the source of our rerendering problems!?
  componentDidUpdate(prevProps, prevState) {
    const { isAuthenticated, devices, subscribeDevices, loadedOnce } = this.props;

    if (isAuthenticated && !this.state.subscribed && devices.length > 0) {
      // make sure this runs only once
      subscribeDevices(devices);
      this.setState({ subscribed: true })
    }

    if (!isAuthenticated || loadedOnce) {
      return;
    }

    this.init()
  }

  init() {
    this.props.fetch();
    this.props.fetchProfile();
    this.props.connectToMqtt();
  }

  render() {
    const { isAuthenticated, createRootNavigator, loadingData } = this.props;

    if (!this.state.authChecked || loadingData) {
      return (
        <Container style={Styles.viewContainer}>
          <Content contentContainerStyle={Styles.loadingContent}>
            <Image source={require('../../images/g-logo.png')} style={Styles.loadingImage}/>
          </Content>
        </Container>
      );
    }

    const Layout = createRootNavigator(isAuthenticated);

    return <Layout />;
  }
}

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);