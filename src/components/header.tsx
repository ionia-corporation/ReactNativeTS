import React from 'react';
import { ViewStyle } from 'react-native';
import { Header, Body, Title, Button, Left, Right, Text } from 'native-base';
import  Icon  from 'react-native-vector-icons/Ionicons';
import  IconMCI  from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect, Dispatch } from 'react-redux';

import { Styles , Colors} from '../styles/main';
import { AppState } from '../types/index';
import { logout } from '../store/auth/actions';

interface OwnProps {
  title: string;
  backButton?: Function;
  searchButton?: boolean;
  logoutButton?: boolean;
}

interface ReduxDispatchProps {
  logout: Function;
}

interface Props extends OwnProps, ReduxDispatchProps {}

export class HeaderApp extends React.Component<Props> {
  async handleSignOut() {
    await this.props.logout();
  }

  render () {
    const { title, backButton, searchButton, logoutButton } = this.props;

    return (
      <Header style={Styles.header} androidStatusBarColor={Colors.neonRed}>
        <Left style={Styles.headerSide}>
          {
            backButton && 
            <Button transparent onPress={() => backButton()}>
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
          {
            logoutButton &&
            <Button transparent onPress={() => this.handleSignOut()}>
              <IconMCI name='logout' style={Styles.headerIcon}/>
            </Button>
          }
        </Right>
      </Header>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: OwnProps): ReduxDispatchProps {
  return {
    logout: (userOptions) => dispatch(logout(userOptions))
  }
}

export const HeaderComponent = connect(null, mapDispatchToProps)(HeaderApp);
export default HeaderComponent;
