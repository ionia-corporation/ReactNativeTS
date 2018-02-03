import React from 'react';
import { Header, Body, Title } from 'native-base';

interface Props {
  title: string;
}

export class HeaderComponent extends React.Component<Props> {
  render () {
    return (
      <Header>
        <Body style={{alignItems: 'center'}}>
          <Title>{this.props.title}</Title>
        </Body>
      </Header>
    );
  }
}

export default HeaderComponent;
