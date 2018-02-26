import React from 'react';
import { Container, Content } from 'native-base';

import { HeaderComponent } from './index';
import Styles from '../styles/main';

class SettingsComponent extends React.Component<any, any> {
  render() {
    return (
      <Container style={Styles.viewContainer}>
        <HeaderComponent title='Settings'/>

        <Content/>
      </Container>
    );
  }
}

export const Settings = SettingsComponent;