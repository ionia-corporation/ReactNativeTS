import React from 'react';
import { NavigationScreenConfigProps, NavigationActions } from 'react-navigation';
import { Container, Content, Button, Text, Form, Item, Label, Input, View } from 'native-base';
import { connect, Dispatch } from 'react-redux';
import  Icon  from 'react-native-vector-icons/Ionicons';

import xively from '../lib/xively';
import { HeaderComponent } from './index';
import Styles from '../styles/main';
import { AppState } from '../types/index';
import { getProfile, UserProfile } from '../store/profile/reducers';
import { updateProfile, updateFailure } from '../store/profile/actions';

interface OwnProps {}

interface ReduxStateProps {
  profile: UserProfile;
}

interface ReduxDispatchProps {
  updateProfile;
  updateFailure;
}

function mapStateToProps(state: AppState, ownProps: OwnProps): ReduxStateProps {
  const profile: UserProfile = getProfile(state);

  return {
    profile
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: OwnProps): ReduxDispatchProps {
  return {
    updateProfile: (profile: UserProfile, newEmail?: string, updatePass?: { oldPass: string; newPass: string }) => dispatch(updateProfile(profile, newEmail, updatePass)),
    updateFailure: (error: string) => dispatch(updateFailure(error))
  };
}

interface Props extends 
  ReduxStateProps,
  ReduxDispatchProps {}

interface State {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userPass: string;
  userNewPass: string;
  userPassConfirm: string;
}

export class AccountComponent extends React.Component<Props, State> {
  componentWillMount() {
    const { firstName, lastName, emailAddress } = this.props.profile;

    this.setState({
      userFirstName: firstName || '',
      userLastName: lastName || '',
      userEmail: emailAddress || ''
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { userFirstName, userLastName, userEmail } = this.state;
    const { firstName, lastName, emailAddress } = nextProps.profile;

    if (
      userFirstName !== firstName ||
      userLastName !== lastName ||
      userEmail !== emailAddress
    ) {
      this.setState({
        userFirstName: firstName,
        userLastName: lastName,
        userEmail: emailAddress
      })
    }
  }

  async save() {
    const { userId, emailAddress } = this.props.profile;
    const { userFirstName, userLastName, userEmail, userPass, userNewPass, userPassConfirm } = this.state;

    const profile: UserProfile = {
      userId,
      name: `${userFirstName} ${userLastName}`,
      firstName: userFirstName,
      lastName: userLastName
    };

    const updateEmail = (userEmail !== emailAddress) && userEmail;

    let updatePassword;

    if (userPass) {
      if ((userNewPass || userPassConfirm) && userNewPass !== userPassConfirm) {
        return this.props.updateFailure('Password does not match the confirm password.');
      }

      updatePassword = {
        oldPass: userPass,
        newPass: userNewPass
      };
    }

    this.props.updateProfile(profile, updateEmail, updatePassword);
  }

  render() {
    const { userFirstName, userLastName, userEmail, userPass, userNewPass, userPassConfirm } = this.state;

    return (
      <Container style={Styles.viewContainer}>
        <HeaderComponent title='Account' logoutButton/>

        <Content>
          <View style={Styles.accountHeader}>
            <View style={Styles.accountIconContainer}>
              <Icon name='ios-person' style={Styles.accountUserIcon}/>
            </View>
          </View>

          <View style={Styles.formContainer}>
            <Form style={Styles.form}>
              <Item style={Styles.formItem} stackedLabel>
                <Label>{ userFirstName ? 'User\'s First Name' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'User\'s First Name'}
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={userFirstName}
                  onChangeText={(text) => this.setState({ userFirstName: text })}
                />
              </Item>

              <Item style={Styles.formItem} stackedLabel>
                <Label>{ userLastName ? 'User\'s Last Name' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'User\'s Last Name'}
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={userLastName}
                  onChangeText={(text) => this.setState({ userLastName: text })}
                />
              </Item>

              <Item style={Styles.formItem} stackedLabel>
                <Label>{ userEmail ? 'Email Address' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'Email Address'}
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={userEmail}
                  onChangeText={(text) => this.setState({ userEmail: text })}
                />
              </Item>

              <Item style={Styles.formItem} stackedLabel>
                <Label>{ userPass ? 'Current Password' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'Password'}
                  secureTextEntry={true}
                  value={userPass}
                  onChangeText={(text) => this.setState({ userPass: text })}
                />
              </Item>

              <Item style={Styles.formItem} stackedLabel>
                <Label>{ userNewPass ? 'Password' : '' }</Label>

                <Input
                  style={Styles.formInput}
                  placeholder={'Password'}
                  secureTextEntry={true}
                  value={userNewPass}
                  onChangeText={(text) => this.setState({ userNewPass: text })}
                />
              </Item>

              <Item style={Styles.formItem} stackedLabel>
                <Label>{ userPassConfirm ? 'Confirm Password' : '' }</Label>

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
              style={Styles.formButton}
              rounded
              dark
              onPress={() => this.save()}>
              <Text>DONE</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

export const Account = connect(mapStateToProps, mapDispatchToProps)(AccountComponent);
