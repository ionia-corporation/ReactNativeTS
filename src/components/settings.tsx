import React from 'react';
import { Container, Content } from 'native-base';

import { HeaderComponent } from './index';

class SettingsComponent extends React.Component<any, any> {
  render() {
    return (
      <Container>
        <HeaderComponent title='Settings'/>

        <Content/>
      </Container>
    );
  }
}

export const Settings = SettingsComponent;