import * as React from 'react';
import { Text, Button, View } from 'native-base';
import  Icon  from 'react-native-vector-icons/FontAwesome';

import Styles from '../styles/main';

interface Props {
  facebook?: boolean;
  google?: boolean;
}

export const OauthSigninButtons = (props: Props) => {
  return (
    <View>
      {
        props.facebook &&
        <Button style={Styles.loginFacebookButton} rounded iconLeft>
          <Icon name='facebook-f' style={Styles.loginSocialIcon}/>

          <Text uppercase={false}>
            Log in with Facebook
          </Text>
        </Button>
      }

      {
        props.google &&
        <Button style={Styles.loginGoogleButton} rounded iconLeft>
          <Icon name='google' style={Styles.loginSocialIcon}/>

          <Text uppercase={false}>
            Log in with Google
          </Text>
        </Button>
      }
    </View>
  );
}

export default OauthSigninButtons;
