import * as React from 'react';
import { NavigationScreenConfigProps, NavigationActions } from 'react-navigation';
import { Container, Header, Content, Form, Item, Input, Text, Button, View } from 'native-base';
import { Image, Switch } from "react-native";

import xively from '../lib/xively';
import Styles from '../styles/main';

// TODO: move this enum
enum RequestStatus { REQUEST_NOT_SENT, REQUEST_ERROR, REQUEST_SENT, REQUEST_SUCCESS };

interface LoginProps extends
  React.Props<LoginScreen>,
  NavigationScreenConfigProps { }

interface LoginState {
  requestStatus?: RequestStatus;
  errors?: string;
  username?: string;
  password?: string;
  rememberMe?: boolean;
}

const tabsNames = ['Devices', 'Settings', 'Account', 'Help'];

export class LoginScreen extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      requestStatus: RequestStatus.REQUEST_NOT_SENT,
      errors: '',
      username: '',
      password: '',
      rememberMe: false,
    };
  }

  async submit() {
    let userOptions = {
      emailAddress: this.state.username,
      password: this.state.password,
      renewalType: this.state.rememberMe ? 'remembered' : 'short',
    };

    this.setState({
      requestStatus: RequestStatus.REQUEST_SENT,
    });

    try {

      let res = await xively.idm.authentication.login(userOptions);

      // Successfully logged in
      if (!res.jwt) {
        throw new Error('Not Authorized');
      }

      this.setState({ requestStatus: RequestStatus.REQUEST_SUCCESS });

      // TODO: select the correct route
      const { state } = this.props.navigation;

      let routeName = state.params && state.params.nextRoute || 'App';
      routeName = tabsNames.indexOf(routeName) !== -1 ? 'App' : routeName;

      const params = state.params && state.params.nextRouteParams || {};

      // reset nav stack
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName, params }),
        ]
      });

      this.props.navigation.dispatch(resetAction);

      // // Login is now in a drawer navigator, so don't have to reset stack
      // this.props.navigation.navigate(routeName, params);

    } catch (err) {
      // Server Error
      if ( err.message === 'Unauthorized') {
        this.setState({
          requestStatus: RequestStatus.REQUEST_ERROR,
          errors : 'The credentials you provided don\'t match anything in our system. Forgot password?',
        });
      } else {
        this.setState({
          requestStatus: RequestStatus.REQUEST_ERROR,
          errors : err.message,
        });
      }
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Container style={Styles.viewContainer}>
        <Content>
          <View style={Styles.loginHeader}>
            <Image source={require('../../images/g-logo.png')} style={Styles.loginHeaderImage} />

            <Text style={Styles.loginHeaderTitle}>
              GENERIC SYSTEMS
            </Text>
          </View>

          <Form>
            <Item>
              <Input
                placeholder='Username'
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(text) => this.setState({ username: text })}/>
            </Item>

            <Item last>
              <Input
                placeholder='Password'
                secureTextEntry={true}
                onChangeText={(text) => this.setState({ password: text })}/>
            </Item>
          </Form>

          <View style={Styles.switchContainer}>
            <Switch
              value={this.state.rememberMe}
              onValueChange={(value) => this.setState({rememberMe: value})}
            />

            <Text>
              Stay signed in
            </Text>
          </View>

          <Text>
            { this.state.errors }
          </Text>

          <Button rounded dark onPress={() => this.submit()}>
            <Text>Login</Text>
          </Button>

          <Text style={Styles.paragraph}>
            Don't have an account? <Text style={Styles.link} onPress={() => navigate('SignUp')}>Sign up</Text>
          </Text>
        </Content>
      </Container>
    );
  }
}

export default LoginScreen;
