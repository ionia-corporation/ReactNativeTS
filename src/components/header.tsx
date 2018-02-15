import React from 'react';
import { Header, Body, Title, Button, Left, Right, Text } from 'native-base';
import  Icon  from 'react-native-vector-icons/Ionicons';

import { Styles , Colors} from '../styles/main';

interface Props {
  title: string;
  leftButton?: {
    text?: string;
    icon?: string;
    onPess: Function;
  };
  searchButton?: boolean;
}

export class HeaderComponent extends React.Component<Props> {
  render () {
    const { title, leftButton, searchButton } = this.props;

    return (
      <Header style={Styles.header} androidStatusBarColor={Colors.neonRed}>
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
          <Title>
            <Text style={Styles.headerTitle}>{ title }</Text>
          </Title>
        </Body>

        {
          searchButton && 
          <Right>
            <Icon name='ios-search' style={Styles.headerIcon}/>
          </Right>
        }
      </Header>
    );
  }
}

export default HeaderComponent;
