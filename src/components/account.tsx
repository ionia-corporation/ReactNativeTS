import React from 'react';
import { NavigationScreenConfigProps } from 'react-navigation';
import { Container, Content, Button, Text } from 'native-base';

import { Authenticated } from './authenticated';
import { HeaderComponent } from './index';
import Styles from '../styles/main';

interface Props extends NavigationScreenConfigProps {}

export class AccountComponent extends React.Component<Props> {
  render() {
    return (
      <Container style={Styles.viewContainer}>
        <HeaderComponent title='Account'/>

        <Content>
          <Button onPress={() => this.props.navigation.navigate('Logout')}>
            <Text>Logout</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export let Account = Authenticated(AccountComponent);
export default Account;