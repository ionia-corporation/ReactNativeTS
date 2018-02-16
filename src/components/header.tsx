import React from 'react';
import { ViewStyle } from 'react-native';
import { Header, Body, Title, Button, Left, Right, Text } from 'native-base';
import  Icon  from 'react-native-vector-icons/Ionicons';

import { Styles , Colors} from '../styles/main';

interface Props {
  title: string;
  backButton?: Function;
  searchButton?: boolean;
}

export class HeaderComponent extends React.Component<Props> {
  render () {
    const { title, backButton, searchButton } = this.props;

    return (
      <Header style={Styles.header} androidStatusBarColor={Colors.neonRed}>
        <Left style={Styles.headerSide}>
          {
            backButton && 
            <Button transparent onPress={() => {
              backButton();
            }}>
              <Icon name='ios-arrow-back' style={Styles.headerIcon}/>
            </Button>
          }
        </Left>

        <Body style={Styles.headerBody}>
          <Title>
            <Text style={Styles.headerTitle}>{ title }</Text>
          </Title>
        </Body>

        <Right style={Styles.headerSide}>
          {
            searchButton &&
            <Icon name='ios-search' style={Styles.headerIcon}/>
          }
        </Right>
      </Header>
    );
  }
}

export default HeaderComponent;
