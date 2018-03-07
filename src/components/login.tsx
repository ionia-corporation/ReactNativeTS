import * as React from 'react';
import { NavigationScreenConfigProps, NavigationActions } from 'react-navigation';
import { Container, Header, Content, Form, Item, Input, Text, Button, View, Label } from 'native-base';
import { Image, Switch, ImageBackground } from "react-native";
import { connect, Dispatch } from 'react-redux';

import xively from '../lib/xively';
import Styles from '../styles/main';
import { OauthSigninButtons } from './index'
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
  username?: string;
  password?: string;
  rememberMe?: boolean;
  error?: string;
}

export class LoginScreenComponent extends React.Component<LoginProps, LoginState> {
  state = {
    username: '',
    password: '',
    rememberMe: false,
    error: null
  };

  constructor(props: LoginProps) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({error: nextProps.error});
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
    const { username, password, error } = this.state;

    return (
      <Container style={Styles.viewContainer}>
        <Content>
          <ImageBackground style={Styles.loginHeader} source={require('../../images/loginHeader.png')}>
            <Image source={require('../../images/g-logo.png')} style={Styles.loginHeaderImage} />

            <Text style={Styles.loginHeaderTitle}>
              GENERIC SYSTEMS
            </Text>
          </ImageBackground>

          <View style={Styles.formContainer}>
            <Form style={Styles.form}>
              <Item style={Styles.formItem} stackedLabel>
                <Label>{ username ? 'Email' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder='Email'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoCorrect={false}
                  onChangeText={(text) => this.setState({ username: text })}
                />
              </Item>

              <Item style={Styles.formItem} stackedLabel>
                <Label>{ password ? 'Password' : '' }</Label>

                <Input
                  style={[Styles.formInput, Styles.formInputPass]}
                  placeholder='Password'
                  secureTextEntry={true}
                  onChangeText={(text) => this.setState({ password: text })}
                />

                <Text style={Styles.formInputLink}>
                  FORGOT?
                </Text>
              </Item>

              <View style={Styles.switchContainer}>
                <Switch
                  style={Styles.switch}
                  value={this.state.rememberMe}
                  onValueChange={(value) => this.setState({rememberMe: value})}
                />

                <Text style={Styles.switchText}>
                  Stay signed in
                </Text>
              </View>
            </Form>

            {
              error &&
              <Text style={Styles.errorMessage}>
                { error }
              </Text>
            }

            <Button style={Styles.formButton} rounded dark onPress={() => this.submit()}>
              <Text>SIGN IN</Text>
            </Button>

            <View style={Styles.loginSignUpText}>
              <Text style={Styles.formParagraph}>Don't have an account?</Text>

              <Button transparent style={Styles.loginSignUpLink} onPress={() => navigate('SignUp')}>
                <Text uppercase={false} style={Styles.link}>Sign up</Text>
              </Button>
            </View>

            <OauthSigninButtons facebook google/>
          </View>
        </Content>
      </Container>
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