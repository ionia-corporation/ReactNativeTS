import * as React from 'react';
import { Container, Content, Title } from 'native-base';
import { NavigationScreenConfigProps } from 'react-navigation';

import Styles from '../styles/main';
import xively from '../lib/xively';

interface LogoutProps extends
    React.Props<LogoutScreen>,
    NavigationScreenConfigProps {
}

export class LogoutScreen extends React.Component<LogoutProps, void> {
  async componentWillMount() {
    await xively.idm.authentication.logout();
    this.props.navigation.navigate('SignedOut');
  }

  static navigationOptions = {
    title: 'Logging Out...',
  };

  render() {
    return (
      <Container>
        <Content>
          <Title style={Styles.sectionStatus}>
            Logging out
          </Title>
        </Content>
      </Container>
    );
  }
}

export default LogoutScreen;
