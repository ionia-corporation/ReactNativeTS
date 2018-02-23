import React from 'react';
import { NavigationScreenConfigProps, NavigationActions } from 'react-navigation';
import { Container, Content, Button, Text } from 'native-base';
import { connect, Dispatch } from 'react-redux';

import xively from '../lib/xively';
import { HeaderComponent } from './index';
import Styles from '../styles/main';

import { AppState } from '../types/index';
import { logout } from '../store/auth/actions';

interface ReduxStateProps {

}

interface ReduxDispatchProps {
  logout: Function;
}

interface Props extends 
  ReduxStateProps,
  ReduxDispatchProps,
  NavigationScreenConfigProps {}

export class AccountComponent extends React.Component<Props> {
  async handleSignOut() {
    await this.props.logout();
  }

  render() {
    return (
      <Container style={Styles.viewContainer}>
        <HeaderComponent title='Account'/>

        <Content>
          <Button onPress={this.handleSignOut.bind(this)}>
            <Text>Logout</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state: AppState, ownProps: Props): ReduxStateProps {
  return {
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: Props): ReduxDispatchProps {
  return {
    logout: (userOptions) => dispatch(logout(userOptions))
  }
}

export const Account = connect(mapStateToProps, mapDispatchToProps)(AccountComponent);
