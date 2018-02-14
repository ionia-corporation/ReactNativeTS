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
import { checkAuthentication } from '../store/auth/actions';
import Styles from '../styles/main';
import { isEqual } from 'lodash';


interface ReduxStateProps {
  loading: boolean;
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
  return {
    loading: state.blueprint.devices.loading || state.blueprint.organizations.loading || state.profile.loading,
    devices: values(state.blueprint.devices.data),
    loadedOnce: state.blueprint.devices.loadedOnce,
    isAuthenticated: state.auth.isAuthenticated,
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
}
class AppComponent extends React.Component<Props, State> {
  
  state = {
    subscribed: false
  }

  async componentDidMount() {
    await this.props.checkAuthentication();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !isEqual(this.props.devices, nextProps.devices) ||
      this.props.isAuthenticated !== nextProps.isAuthenticated ||
      this.props.loading !== nextProps.loading ||
      this.props.loadedOnce !== nextProps.loadedOnce
     ) {
       return true;
     }
     return false;
  }

  // Runs before new props
  // This happens while navigating to different pages on the app
  // TODO: Is this the source of our rerendering problems!?
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isAuthenticated && !this.state.subscribed && this.props.devices.length > 0) {
      // make sure this runs only once
      this.props.subscribeDevices(this.props.devices);
      this.setState({ subscribed: true })
    }

    if (!this.props.isAuthenticated || (this.props.loadedOnce && this.props.devices.length > 0)) {
      return;
    }
    this.init()
    // this.props.navigation.navigate('SignedIn');
  }

  init() {
    this.props.fetch();
    this.props.fetchProfile();
    this.props.connectToMqtt();
  }

  render() {
    const { isAuthenticated, createRootNavigator } = this.props;
    console.log(this.props)
    // if (!isAuthenticated) {
    //   return (
    //     <Container>
    //       <Content>
    //         <Title style={Styles.sectionStatus}>
    //           Loading
    //         </Title>
    //       </Content>
    //     </Container>
    //   );
    // }

    const Layout = createRootNavigator(isAuthenticated)
    return <Layout />;
  }
}

export const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);