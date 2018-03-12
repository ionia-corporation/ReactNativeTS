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
}

interface Props extends 
  ReduxStateProps,
  ReduxDispatchProps {}

export class AccountComponent extends React.Component<Props> {

  render() {
    return (
      <Container style={Styles.viewContainer}>
        <HeaderComponent title='Account' logoutButton/>

        <Content>
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
  }
}

export const Account = connect(mapStateToProps, mapDispatchToProps)(AccountComponent);
