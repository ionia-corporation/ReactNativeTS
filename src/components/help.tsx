import React from 'react';
import { Container, Content } from 'native-base';

import { Authenticated } from './authenticated';
import { HeaderComponent } from './index';

export class HelpComponent extends React.Component<any, any> {
  render() {
    return (
      <Container>
        <HeaderComponent title='Help'/>

        <Content/>
      </Container>
    );
  }
}

export let Help = Authenticated(HelpComponent);
export default Help;