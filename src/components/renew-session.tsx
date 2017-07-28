import * as React from 'react';
import { View, Text } from "react-native";
import Styles from '../styles/main';
import { NavigationScreenConfigProps, NavigationParams, NavigationInitAction } from 'react-navigation';
import xively from '../lib/xively';

interface RenewSessionProps extends
  React.Props<RenewSessionScreen>,
  NavigationScreenConfigProps {
}

interface RenewSessionState {
}

export class RenewSessionScreen extends React.Component<RenewSessionProps, RenewSessionState> {
  componentDidMount() {
    // renew-session
    xively.comm.checkJwt()
      .then((good) => {
        if (good) {
          this.props.navigation.goBack();
          this.props.navigation.navigate(
            this.props.navigation.state.params.nextRoute,
            this.props.navigation.state.params.nextRouteParams)
        } else {
          // TODO: pick the correct route to redirect to here
          this.props.navigation.goBack();
          this.props.navigation.navigate('Root/Login');
        }
      })
      .catch((err) => {
        // // TODO: clear stack
        // this.props.navigation.dispatch(NavigationInitAction)
        this.props.navigation.goBack();

        // TODO: pick the correct route to redirect to here
        this.props.navigation.navigate('Root/Login');
      });
  }

  static navigationOptions = {
    title: 'RenewSession',
  };
  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.title}>
          Loading...
              </Text>
      </View>
    );
  }
}

export default RenewSessionScreen;
