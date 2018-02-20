import * as React from 'react';
import xively from '../lib/xively';
import { NavigationScreenConfigProps, NavigationActions } from 'react-navigation';
import { KeyboardAvoidingView, View, Text, TextInput, Button, Image, Switch } from "react-native";
import { connect, Dispatch } from 'react-redux';
import Styles from '../styles/main';
import { AppState } from '../types/index';
import { login } from '../store/auth/actions';

interface ReduxDispatchProps {
  login: Function;
}

interface ReduxStateProps {
  error: string;
}


interface LoginProps extends
  ReduxDispatchProps,
  ReduxStateProps,
  React.Props<LoginScreenComponent>,
  NavigationScreenConfigProps { }

interface LoginState {
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
    await this.props.login(userOptions);
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
          { this.props.error }
        </Text>

        <Button title='Login' onPress={this.submit.bind(this)} />

        <Text style={Styles.paragraph} onPress={() => navigate('SignUp')}>
          Don't have an account? <Text style={Styles.link} >Sign up</Text>
        </Text>
      </KeyboardAvoidingView>
    );
  }
}

function mapStateToProps(state: AppState, ownProps: LoginProps) {
  return {
    error: state.auth.error,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: LoginProps): ReduxDispatchProps {
  return {
    login: (userOptions) => dispatch(login(userOptions))
  }
}


export const LoginScreen = connect(mapStateToProps, mapDispatchToProps)(LoginScreenComponent)