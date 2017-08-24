import * as React from 'react';
import { View, Text, Button } from "react-native";
import Styles from '../styles/main';
import { NavigationScreenConfigProps } from 'react-navigation';
import xively from '../lib/xively';

interface LogoutProps extends
    React.Props<LogoutScreen>,
    NavigationScreenConfigProps {
}

export class LogoutScreen extends React.Component<LogoutProps, void> {
  componentWillMount() {
    xively.idm.authentication.logout();
    this.props.navigation.navigate('Login');
  }
  static navigationOptions = {
    title: 'Logging Out...',
  };
  render() {
    return (
      <View>
        <Text style={Styles.title}>
          Logging out
        </Text>
      </View>
    );
  }
}

export default LogoutScreen;
