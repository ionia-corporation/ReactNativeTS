import React from 'react';
import { Container, Content } from 'native-base';

import { Authenticated } from './authenticated';
import { HeaderComponent } from './index';

export class SettingsComponent extends React.Component<any, any> {
  render() {
    return (
      <Container>
        <HeaderComponent title='Settings'/>

        <Content/>
      </Container>
    );
  }
}

export let Settings = Authenticated(SettingsComponent);
export default Settings;