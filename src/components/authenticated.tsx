import * as React from 'react';
import { Text } from 'react-native';
import { connect, Dispatch } from 'react-redux';
import { Device, AppState } from '../types/index';
import { values } from 'lodash';
import xively from '../lib/xively';
import { batchRequest } from '../store/blueprint/actions';
import { fetchProfile } from '../store/profile/actions';
import { NavigationScreenConfigProps, NavigationParams, NavigationInitAction } from 'react-navigation';
import { actions as mqttActions } from '../store/mqtt';

// TODO: since we are not resuing this authenticated logic for any other component
// this should be just a regular component that renders conditionally the App component
// based on authentication instead of being a HOC
export const Authenticated = (DecoratedComponent) => {

  interface OwnProps {
    logout: any;
    username: string;
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

  const displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

  class AuthenticatedComponent extends React.Component<AuthenticatedProps, AuthenticatedState> {
    subscribed = false;
    checkingAuth = false;
    static displayName = 'Authenticated(' + displayName + ')';

    constructor(props) {
      super(props);

      // We are validating the session related token every time the user changes the page
      // this piece of state is used to avoid rendering the site while we are validating the session.
      // Most of the time this will be done in a single tick since XivelyComm is smart enough
      // to only validate tokens when they are expired.
      // Potential improvements:
      // - Better UX that indicates that we are working

      this.state = {
        isAuthenticated: false,
      };
    }

    componentDidMount() {
      this.checkAuth(this.props);
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
      this.checkAuth(nextProps);
      if (!this.subscribed && this.props.devices.length > 0) {
        // make sure this runs only once
        this.props.subscribeDevices(this.props.devices);
        this.subscribed = true;
      }
    }

    async checkAuth(props: AuthenticatedProps) {
      if (this.checkingAuth) {
        return;
      }

      this.checkingAuth = true;
      try {
        const isLoggedIn = await xively.comm.checkJwt();

        if (!isLoggedIn) {
          this.redirectToLogin(props);
          return;
        }

        // If we've made it this far, we're still valid
        this.setState({
          isAuthenticated: true
        });
      } catch (e) {
        console.warn('ERROR checking auth: ' + e.message);
        this.redirectToLogin(props);
        return;
      } finally {
        this.checkingAuth = false;
      }
    }


    redirectToLogin(props: AuthenticatedProps) {
      xively.idm.authentication.logout();

      this.props.navigation.navigate('Login', {
        nextRoute: this.props.navigation.state.routeName,
        nextProps: this.props.navigation.state.params,
      });
    }

    render() {
      const { isAuthenticated } = this.state;

      if (!isAuthenticated) {
        return <Text>Loading</Text>;
      }

      // TODO: figure out what props we should be sending down (should we prune out the router?)
      return <DecoratedComponent { ...this.props } />;
    }
  }

  const Authenticated = connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
  return Authenticated;
};
