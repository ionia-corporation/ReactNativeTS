import React from 'react';
import { Header, Body, Title, Button, Left, Text } from 'native-base';

interface Props {
  title: string;
  leftButton?: {
    text?: string;
    icon?: string;
    onPess: Function;
  };
}

export class HeaderComponent extends React.Component<Props> {
  render () {
    const { title, leftButton } = this.props;

    return (
      <Header>
        {
          leftButton && 
          <Left>
            <Button onPress={() => {
              if (leftButton.onPess) leftButton.onPess();
            }}>
              <Text>
                { leftButton.text || '' }
              </Text>
            </Button>
          </Left>
        }

        <Body style={{alignItems: leftButton ? 'flex-start' : 'center'}}>
          <Title>{ title }</Title>
        </Body>
      </Header>
    );
  }
}

export default HeaderComponent;
