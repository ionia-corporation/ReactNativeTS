import * as React from 'react';
import xively from '../lib/xively';
import { NavigationScreenConfigProps, NavigationActions } from 'react-navigation';
import { KeyboardAvoidingView, View, Text, TextInput, Button, Image } from "react-native";
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
      renewalType: this.state.rememberMe === true ? 'remembered' : 'short',
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
      const routeName = this.props.navigation.state.params
        && this.props.navigation.state.params.nextRoute || 'DeviceList';
      const params = this.props.navigation.state.params
        && this.props.navigation.state.params.nextRouteParams || {};

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
      <KeyboardAvoidingView behavior='padding' style={Styles.container}>
        <Image style={Styles.logo} source={require('../../images/logo.png')} />

        <Text style={Styles.title}>
          Sign In
        </Text>

        <View style={Styles.inputWrapper}>
          <TextInput
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='Email Address'
            onChangeText={(text) => this.setState({ username: text })}
            style={Styles.input}
          />
        </View>

        <View style={Styles.inputWrapper}>
          <TextInput
            placeholder='Password'
            secureTextEntry={true}
            onChangeText={(text) => this.setState({ password: text })}
            style={Styles.input}
          />
        </View>

        <Text>
          { this.state.errors }
        </Text>

        <Button title='Login' onPress={() => { this.submit(); }} />

        <Text>
          Don't have an account? <Text onPress={() => navigate('SignUp')}>Sign up</Text>
        </Text>
      </KeyboardAvoidingView>
    );
  }
}

export default LoginScreen;
