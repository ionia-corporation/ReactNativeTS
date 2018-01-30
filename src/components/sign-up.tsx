import * as React from 'react';
import { NavigationScreenConfigProps } from 'react-navigation';
import { KeyboardAvoidingView, View, Text, TextInput, Button, Image, ScrollView } from "react-native";

import Styles from '../styles/main';
import { config } from '../config';
import xively from '../lib/xively';
import { RequestStatus } from '../types/index';
import * as localAPI from '../lib/local-api/index';

interface SignUpProps extends NavigationScreenConfigProps {
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
  form: any;

  constructor(props: SignUpProps) {
    super(props);

    this.state = {
      requestStatus: RequestStatus.REQUEST_NOT_SENT,
      error: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    };
  }

  async submit() {
    this.setState({ requestStatus : RequestStatus.REQUEST_SENT });

    let userOptions = {
      emailAddress : this.state.email,
      password : this.state.password,
      passwordConfirm : this.state.passwordConfirm,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
    };

    try {
      if (userOptions.password !== userOptions.passwordConfirm) {
        throw new Error('Password does not match the confirm password.');
      }

      let res = await xively.idm.authentication.createUser(userOptions);

      if (!res.userId) {
        // TODO: Throw something better
        throw new Error('No user ID passed in');
      }

      const accountId = config.xively.accountId;
      const endUserTemplateId = config.xively.endUserTemplate;
      const orgTemplateId = config.xively.baseOrgTemplate;

      // Login user to obtain JWT
      await xively.idm.authentication.login({
        emailAddress : this.state.email,
        password : this.state.password,
        renewalType: 'extended',
      });

        // Create new org and end user in that org
      let orgRes = await xively.blueprint.organizations.createOrganization({
        accountId: accountId,
        name: 'Organization for ' + this.state.email,
        organizationTemplateId: orgTemplateId,
        endUserTemplateId: endUserTemplateId,
      });

      if (!orgRes || !orgRes.organization.id || !orgRes.organization.defaultEndUser) {
        // TODO: Is this block needed?
        // TODO: Throw something better
        throw new Error('Org was not created right');
      }

      // Update status to update the loading indicator
      this.setState({ requestStatus : RequestStatus.REQUEST_SUCCESS });

      return await localAPI.user.registrationSuccess(res.userId);

    } catch (err) {
      // Server Error
      console.log(err);
    
      let errorMsg = 'An error has occurred. Please try it again.';

      // check for Xively error first, then localAPI error
      if (err.response && err.response.body && err.response.body.message) {
        // error on HTTP REQUEST
        if (err.response.body.message === 'The user already exists.') {
          // TODO: Link to login screen?
          errorMsg = 'This email is already registered, did you mean to login?';
        } else if (err.response.body.message.strengthValue >= 0) {
          errorMsg = `Invalid password. Your password must be between 8 and 128
            characters in length. It must not repeat 3 characters in a row. It must not
            contain any of the top 20 passwords. It must not contain your email username.`;
        }
      } if (err.message) {
        errorMsg = err.message;
      }

      this.setState({
        error : errorMsg,
        requestStatus : RequestStatus.REQUEST_ERROR,
      });
    }
  }

  handleChange(fieldName, event) {
    const value = event.target.value;

    this.setState((state) => {
      state[fieldName] = value;
      return state;
    });
  }

  userCreatedAlert() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Text>
          Registration successful! 
          <Text style={Styles.link} onPress={() => navigate('Devices')}>Please click here to proceed.</Text>
        </Text>
      </View>
    );
  }

  render() {
    const { navigate } = this.props.navigation;

    if (this.state.requestStatus === RequestStatus.REQUEST_SUCCESS) {
      return this.userCreatedAlert();
    }

    return (
      <KeyboardAvoidingView keyboardVerticalOffset={0} style={Styles.container}>
        <Image style={Styles.logo} source={require('../../images/logo.png')} />

        <Text style={Styles.title}>
          Sign up
        </Text>

        <View style={Styles.inputWrapper}>
          <TextInput
            keyboardType='default'
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='First Name'
            onChangeText={(text) => this.setState({ firstName: text })}
            style={Styles.input}
          />
        </View>

        <View style={Styles.inputWrapper}>
          <TextInput
            keyboardType='default'
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='Last Name'
            onChangeText={(text) => this.setState({ lastName: text })}
            style={Styles.input}
          />
        </View>

        <View style={Styles.inputWrapper}>
          <TextInput
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='Email Address'
            onChangeText={(text) => this.setState({ email: text })}
            style={Styles.input}
          />
        </View>

        <Text style={Styles.paragraph}>
          Please enter a password. It should contain at least 8 characters including one capital letter, one number, and one special character.
        </Text>

        <View style={Styles.inputWrapper}>
          <TextInput
            placeholder='Password'
            secureTextEntry={true}
            onChangeText={(text) => this.setState({ password: text })}
            style={Styles.input}
          />
        </View>

        <View style={Styles.inputWrapper}>
          <TextInput
            placeholder='Confirm Password'
            secureTextEntry={true}
            onChangeText={(text) => this.setState({ passwordConfirm: text })}
            style={Styles.input}
          />
        </View>

        <Text style={Styles.errorMessage}>
          { this.state.error }
        </Text>

        <Button title='Login' onPress={() => { 
            this.submit();
          }}
        />

        <Text style={Styles.paragraph}>
          Already have an account? <Text style={Styles.link} onPress={() => navigate('Login')}>Sign in</Text>
        </Text>
      </KeyboardAvoidingView>
    );
  }
}

export const SignUp = SignUpComponent;

export default SignUp;
