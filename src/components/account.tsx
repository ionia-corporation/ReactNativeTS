import React from 'react';
import { NavigationScreenConfigProps, NavigationActions } from 'react-navigation';
import { Container, Content, Button, Text, Form, Item, Label, Input, View } from 'native-base';
import { connect, Dispatch } from 'react-redux';
import  Icon  from 'react-native-vector-icons/Ionicons';

import xively from '../lib/xively';
import { HeaderComponent, ErrorMessage } from './index';
import { Styles, Colors } from '../styles/main';
import { AppState } from '../types/index';
import { getProfile, UserProfile } from '../store/profile/reducers';
import { updateProfile, updateFailure } from '../store/profile/actions';
import RequestModal from './request-modal';
import { login } from '../store/auth/actions';

interface OwnProps {}

interface ReduxStateProps {
  profile: UserProfile;
  currentPassError: string;
  error: string;
}

interface ReduxDispatchProps {
  updateProfile;
  updateFailure;
  login;
}

function mapStateToProps(state: AppState, ownProps: OwnProps): ReduxStateProps {
  const profile: UserProfile = getProfile(state);

  return {
    profile,
    currentPassError: state.auth.error,
    error: state.profile.error
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: OwnProps): ReduxDispatchProps {
  return {
    updateProfile: (profile: UserProfile, newEmail?: string, updatePass?: { oldPass: string; newPass: string }) => dispatch(updateProfile(profile, newEmail, updatePass)),
    updateFailure: (error: string) => dispatch(updateFailure(error)),
    login: (userOptions) => dispatch(login(userOptions))
  };
}

interface Props extends 
  ReduxStateProps,
  ReduxDispatchProps {}

interface State {
  userFirstName?: string;
  userLastName?: string;
  userRol?: string;
  userEmail?: string;
  userPass?: string;
  userNewPass?: string;
  userPassConfirm?: string;
  showModal?: boolean;
  updateEmail?: boolean;
  updatePassword?: boolean;
  newUserProfile?: UserProfile;
}

export class AccountComponent extends React.Component<Props, State> {
  state: Partial<State> = {
    showModal: false
  }

  componentWillMount() {
    const { firstName, lastName, emailAddress, department } = this.props.profile;

    this.setState({
      userFirstName: firstName || '',
      userLastName: lastName || '',
      userRol: department || '',
      userEmail: emailAddress || ''
    });
  }

  updateProfile() {
    const { profile: propProfile, updateFailure, updateProfile } = this.props;
    const { userId, emailAddress } = propProfile;
    const { userFirstName, userLastName, userEmail, userPass, userNewPass, userPassConfirm, userRol } = this.state;

    if (userNewPass !== userPassConfirm) {
      return updateFailure('Password does not match the confirm password.');
    }

    const newUserProfile: UserProfile = {
      userId,
      name: `${userFirstName} ${userLastName}`,
      firstName: userFirstName,
      lastName: userLastName,
      department: userRol
    };

    const updateEmail = userEmail !== emailAddress;

    const updatePassword = Boolean(userNewPass && userPassConfirm);

    if (updateEmail || updatePassword) {
      return this.setState({
        showModal: true,
        updateEmail,
        updatePassword,
        newUserProfile
      });
    }

    return updateProfile(newUserProfile);
  }

  async checkCurrentPass() {
    const { userEmail, userPass, userNewPass, newUserProfile, updateEmail, updatePassword } = this.state;
    const { profile, login, updateProfile } = this.props;

    const userOptions = {
      emailAddress: profile.emailAddress,
      password: userPass
    };

    await login(userOptions);

    if (!this.props.currentPassError) {
      updateProfile(
        newUserProfile,
        updateEmail && userEmail,
        updatePassword && { oldPass: userPass, newPass: userNewPass }
      );
    }
  }

  isProfileEdited() {
    const { firstName, lastName, emailAddress, department } = this.props.profile;
    const { userFirstName, userLastName, userRol, userEmail, userNewPass, userPassConfirm } = this.state;

    if (
      firstName !== userFirstName ||
      lastName !== userLastName || 
      emailAddress !== userEmail ||
      department !== userRol ||
      userNewPass && userPassConfirm
    ) {
      return true;
    }

    return false;
  }

  render() {
    const { error, currentPassError } = this.props
    const {
      userFirstName,
      userLastName,
      userRol,
      userEmail,
      userPass,
      userNewPass,
      userPassConfirm,
      showModal
    } = this.state;

    return (
      <Container style={Styles.viewContainer}>
        <RequestModal
          title='Enter Current Password'
          subtitle='This changes require password confirmation'
          submitText='SEND'
          showModal={showModal}
          onModalClose={() => this.setState({
            showModal: false,
            updateEmail: false,
            updatePassword: false,
            newUserProfile: null
          })}
          onModalSubmit={() => this.checkCurrentPass()}
          submitDisabled={userPass && userPass.length ? false : true}
          error={currentPassError}>
          <View style={Styles.formContainer}>
            <Form style={Styles.form}>
              <Item style={Styles.formItem} stackedLabel>
                <Label>{ userPass ? 'Current Password' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'Current Password'}
                  secureTextEntry={true}
                  value={userPass}
                  onChangeText={(text) => this.setState({ userPass: text })}
                />
              </Item>
            </Form>
          </View>
        </RequestModal>

        <Content>
          <ErrorMessage error={error}/>

          <HeaderComponent title='Account' logoutButton>
            <View style={Styles.accountHeader}>
              <View style={Styles.accountIconContainer}>
                <Icon name='ios-person' style={Styles.accountUserIcon}/>
              </View>
            </View>
          </HeaderComponent>

          <View style={Styles.formContainer}>
            <Form style={Styles.form}>
              <Item style={Styles.accountFormItem} stackedLabel>
                <Label style={Styles.formItemLabel}>{ userFirstName ? 'User\'s First Name' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'User\'s First Name'}
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={userFirstName}
                  onChangeText={(text) => this.setState({ userFirstName: text })}
                />
              </Item>

              <Item style={Styles.accountFormItem} stackedLabel>
                <Label style={Styles.formItemLabel}>{ userLastName ? 'User\'s Last Name' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'User\'s Last Name'}
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={userLastName}
                  onChangeText={(text) => this.setState({ userLastName: text })}
                />
              </Item>

              <Item style={Styles.accountFormItem} stackedLabel>
                <Label style={Styles.formItemLabel}>{ userRol ? 'Role (optional)' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'Role (optional)'}
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={userRol}
                  onChangeText={(text) => this.setState({ userRol: text })}
                />
              </Item>

              <Item style={Styles.accountFormItem} stackedLabel>
                <Label style={Styles.formItemLabel}>{ userEmail ? 'Email Address' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'Email Address'}
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={userEmail}
                  onChangeText={(text) => this.setState({ userEmail: text })}
                />
              </Item>

              <Item style={Styles.accountFormItem} stackedLabel>
                <Label style={Styles.formItemLabel}>{ userNewPass ? 'Password' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'Password'}
                  secureTextEntry={true}
                  value={userNewPass}
                  onChangeText={(text) => this.setState({ userNewPass: text })}
                />
              </Item>

              <Item style={Styles.accountFormItem} stackedLabel>
                <Label style={Styles.formItemLabel}>{ userPassConfirm ? 'Confirm Password' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'Confirm Password'}
                  secureTextEntry={true}
                  value={userPassConfirm}
                  onChangeText={(text) => this.setState({ userPassConfirm: text })}
                />
              </Item>
            </Form>

            <Button
              style={Styles.accountFormButton}
              rounded
              disabled={!this.isProfileEdited()}
              onPress={() => this.updateProfile()}>
              <Text>DONE</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export const Account = connect(mapStateToProps, mapDispatchToProps)(AccountComponent);
