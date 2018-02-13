import * as React from 'react';
import xively from '../lib/xively';
import { NavigationScreenConfigProps, NavigationActions } from 'react-navigation';
import { KeyboardAvoidingView, View, Text, TextInput, Button, Image, Switch } from "react-native";
import { connect, Dispatch } from 'react-redux';
import Styles from '../styles/main';
import { AppState } from '../types/index';
import { login } from '../store/auth/actions';

// TODO: move this enum
enum RequestStatus { REQUEST_NOT_SENT, REQUEST_ERROR, REQUEST_SENT, REQUEST_SUCCESS };

interface ReduxDispatchProps {
  login: Function;
}

interface ReduxStateProps {
}


interface LoginProps extends
  ReduxDispatchProps,
  ReduxStateProps,
  React.Props<LoginScreenComponent>,
  NavigationScreenConfigProps { }

interface LoginState {
  requestStatus?: RequestStatus;
  errors?: string;
  username?: string;
  password?: string;
  rememberMe?: boolean;
}

const tabsNames = ['Devices', 'Settings', 'Account', 'Help'];

export class LoginScreenComponent extends React.Component<LoginProps, LoginState> {
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

      let res = await this.props.login(userOptions);

      // Successfully logged in
      if (!res.jwt) {
        throw new Error('Not Authorized');
      }

      this.setState({ requestStatus: RequestStatus.REQUEST_SUCCESS });
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
    console.log('props', this.props);
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

        <Button title='Login' onPress={this.submit.bind(this)} />

        <Text style={Styles.paragraph}>
          Don't have an account? <Text style={Styles.link} onPress={() => navigate('SignUp')}>Sign up</Text>
        </Text>
      </KeyboardAvoidingView>
    );
  }
}

function mapStateToProps(state: AppState, ownProps: LoginProps) {
  return {
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: LoginProps): ReduxDispatchProps {
  console.log('dispatch', login)
  return {
    login: (userOptions) => dispatch(login(userOptions))
  }
}


export const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(LoginScreenComponent)