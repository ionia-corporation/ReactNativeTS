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
import { updateProfile } from '../store/profile/actions';

interface OwnProps {}

interface ReduxStateProps {
  profile: UserProfile;
}

interface ReduxDispatchProps {
  updateProfile: (profile) => void;
}

function mapStateToProps(state: AppState, ownProps: OwnProps): ReduxStateProps {
  const profile: UserProfile = getProfile(state);

  return {
    profile
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: OwnProps): ReduxDispatchProps {
  return {
    updateProfile: (profile: UserProfile) => dispatch(updateProfile(profile)),
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

  async save(profile: UserProfile) {
    try {
      const { userId, emailAddress } = profile;
      const emailAddressHasChanged = this.props.profile.emailAddress !== emailAddress;

      // this.setState({ requestStatus: RequestStatus.REQUEST_SENT, error: undefined });

      // Update profile and email address
      await Promise.all([
        xively.idm.user.updateProfile(profile),
        emailAddressHasChanged && xively.idm.user.updateEmail(userId, emailAddress),
      ]);

      // Get new profile data
      const updatedProfile = await xively.idm.user.getProfile(userId);
      this.props.updateProfile(updatedProfile);

      // this.setState({ requestStatus: RequestStatus.REQUEST_SUCCESS, error: undefined });
    } catch ({ response }) {
      const error = JSON.parse(response.text);

      // this.setState({ requestStatus: RequestStatus.REQUEST_ERROR, error });
    }
  }

  render() {
    const { userFirstName, userLastName, userEmail } = this.state;

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
                  editable={false}
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
                  editable={false}
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
                  editable={false}
                  value={userEmail}
                  onChangeText={(text) => this.setState({ userEmail: text })}
                />
              </Item>
            </Form>
          </View>
        </Content>
      </Container>
    );
  }
}

export const Account = connect(mapStateToProps, mapDispatchToProps)(AccountComponent);
