import * as React from 'react';
import { NavigationScreenConfigProps } from 'react-navigation';
import { Container, Header, Content, Form, Item, Input, Text, Button, View, Label } from 'native-base';
import { connect, Dispatch } from 'react-redux';

import Styles from '../styles/main';
import { RequestStatus } from '../types/index';
import { AppState } from '../types/index';
import { signup, signupAccess, signupFailure } from '../store/auth/actions';
import { HeaderComponent, AddBar, ErrorMessage } from './index';

interface ReduxDispatchProps {
  signup: Function;
  signupAccess: Function;
  signupFailure: Function;
}

interface ReduxStateProps {
  error: string;
  loading: boolean;
}

interface SignUpProps extends 
  ReduxDispatchProps, 
  ReduxStateProps,
  React.Props<SignUpComponent>,
  NavigationScreenConfigProps {
}

interface SignUpState {
  requestStatus?: RequestStatus;
  error?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

export class SignUpComponent extends React.Component<SignUpProps, SignUpState> {
  state = {
    requestStatus: RequestStatus.REQUEST_NOT_SENT,
    error: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  constructor(props: SignUpProps) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const { error, loading } = nextProps;
    const { requestStatus } = this.state;

    if (requestStatus === RequestStatus.REQUEST_SENT && !loading && !error) {
      return this.setState({ requestStatus : RequestStatus.REQUEST_SUCCESS });
    }

    this.setState({error});
  }

  submit() {
    const userOptions = {
      emailAddress : this.state.email,
      password : this.state.password,
      passwordConfirm : this.state.passwordConfirm,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    };

    if (userOptions.password !== userOptions.passwordConfirm) {
      return this.props.signupFailure('Password does not match the confirm password.');
    }

    this.props.signup(userOptions);

    this.setState({ requestStatus : RequestStatus.REQUEST_SENT });
  }

  userCreatedAlert() {
    const { navigate } = this.props.navigation;

    return (
      <Container style={Styles.viewContainer}>
        <HeaderComponent title='Registration successful!'/>

        <Content style={Styles.signupSuccessful}>
          <Button style={Styles.button} onPress={() => this.props.signupAccess()}>
            <Text>Please tap here to proceed</Text>
          </Button>
        </Content>
      </Container>
    );
  }

  render() {
    const { loading } = this.props;
    const { navigate } = this.props.navigation;
    const { firstName, lastName, email, password, passwordConfirm, requestStatus, error } = this.state;

    if (requestStatus === RequestStatus.REQUEST_SUCCESS) {
      return this.userCreatedAlert();
    }

    return (
      <Container style={Styles.viewContainer}>
        <Content style={Styles.signupContent}>
          <ErrorMessage error={error}/>

          <HeaderComponent title='Sign Up'/>

          <View style={Styles.formContainer}>
            <Form style={Styles.form}>
              <Item style={Styles.formItem} stackedLabel>
                <Label>{ firstName ? 'First Name' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  autoCapitalize='none'
                  autoCorrect={false}
                  placeholder='First Name'
                  onChangeText={(text) => this.setState({ firstName: text })}
                />
              </Item>

              <Item style={Styles.formItem} stackedLabel>
                <Label>{ lastName ? 'Last Name' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  autoCapitalize='none'
                  autoCorrect={false}
                  placeholder='Last Name'
                  onChangeText={(text) => this.setState({ lastName: text })}
                />
              </Item>

              <Item style={Styles.formItem} stackedLabel>
                <Label>{ email ? 'Email Address' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  autoCorrect={false}
                  placeholder='Email Address'
                  onChangeText={(text) => this.setState({ email: text })}
                />
              </Item>

              <Text style={Styles.formParagraph}>
                Please enter a password. It should contain at least 8 characters including one capital letter, one number, and one special character.
              </Text>

              <Item style={Styles.formItem} stackedLabel>
                <Label>{ password ? 'Password' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder='Password'
                  secureTextEntry={true}
                  onChangeText={(text) => this.setState({ password: text })}
                />
              </Item>

              <Item style={Styles.formItem} stackedLabel>
                <Label>{ passwordConfirm ? 'Confirm Password' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder='Confirm Password'
                  secureTextEntry={true}
                  onChangeText={(text) => this.setState({ passwordConfirm: text })}
                />
              </Item>
            </Form>

            <Button 
              style={Styles.formButton}
              rounded
              dark
              disabled={loading}
              onPress={() => this.submit()}>
              <Text>Login</Text>
            </Button>

            <View style={Styles.loginSignUpText}>
              <Text style={Styles.formParagraph}>Already have an account?</Text>

              <Button transparent style={Styles.loginSignUpLink} onPress={() => navigate('Login')}>
                <Text uppercase={false} style={Styles.link}>Sign in</Text>
              </Button>
            </View>
            </View>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    error: state.auth.error,
    loading: state.auth.loading
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: SignUpProps): ReduxDispatchProps {
  return {
    signup: (userOptions) => dispatch(signup(userOptions)),
    signupAccess: () => dispatch(signupAccess()),
    signupFailure: (error) => dispatch(signupFailure(error))
  }
}

export const SignUp = connect(mapStateToProps, mapDispatchToProps)(SignUpComponent);