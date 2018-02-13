import React from 'react';
import { NavigationScreenConfigProps, NavigationActions } from 'react-navigation';
import { Container, Content, Button, Text } from 'native-base';
import xively from '../lib/xively';
import { HeaderComponent } from './index';

interface Props extends NavigationScreenConfigProps {}

export class AccountComponent extends React.Component<Props> {
  async handleSignOut() {
    await xively.idm.authentication.logout();
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'SignedOut' })],
      key: null,
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <Container>
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

export const Account = AccountComponent;