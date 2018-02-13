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
}

function mapStateToProps(state: AppState, ownProps: OwnProps): ReduxStateProps {
  return {
  };
}

interface ReduxDispatchProps {
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: OwnProps): ReduxDispatchProps {
  return {
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

  componentWillReceiveProps(nextProps) {
    console.log('APP RECEIVED PROPS', nextProps)
  }

  async componentDidMount() {
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
