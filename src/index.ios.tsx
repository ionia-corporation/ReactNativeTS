import React, { Component, ComponentClass } from 'react';
import { Provider } from 'react-redux';
import { Text, Button } from 'react-native';
import { Authenticated } from './components/authenticated';
import {
  HeaderProps,
  DrawerNavigator,
  DrawerNavigatorConfig,
  StackNavigator,
  StackNavigatorConfig,
  NavigationActions,
  NavigationState,
  TabNavigator,
  TabBarBottom
} from 'react-navigation';

import {
  HomeScreen,
  GroupList,
  SubGroupsScreen,
  GroupDevices,
  DeviceList,
  DeviceScreen,
  LoginScreen,
  LogoutScreen,
  SignUp,
  NavTabs,
  Settings,
  Account,
  Help
} from './components/index';
import configureStore from './store/configure-store';
import xively from './lib/xively';

const TabsNavigation = TabNavigator({
  Devices: {
    screen: DeviceList
  },
  Settings: {
    screen: Settings
  },
  Account: {
    screen: Account
  },
  Help: {
    screen: Help
  },
}, {
  tabBarPosition: 'bottom',
  tabBarComponent: NavTabs,
  initialRouteName: 'Devices'
});

const MainNavigation = StackNavigator({
  TabsNavigation: {
    screen: TabsNavigation
  },
  Device : {
    screen: DeviceScreen
  }
},
{
  initialRouteName: 'TabsNavigation',
  headerMode: 'none'
});

export const SignedIn = StackNavigator({
  App: {
    screen: MainNavigation
  },
  Logout: { 
    screen: LogoutScreen
  },
},
{
  initialRouteName: 'App'
});

export const SignedOut = StackNavigator({
  SignUp: {
    screen: SignUp,
  },
  Login: {
    screen: LoginScreen,
  }
},
{
  initialRouteName: 'Login'
});

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: "none",
      mode: "modal",
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  );
}


let store = configureStore();

type Props = {
  isAuthenticated: boolean;
}
type State = {

}
class App extends React.Component<Props, State> {
  render() {
    const { isAuthenticated } = this.props;
    const Layout = createRootNavigator(isAuthenticated)
    return <Layout />;
  }
}



class AuthenticatedApp extends React.Component<Props, void> {
  render() {
    const AuthenticatedAppContainer: any = Authenticated(App);
    return (
      <Provider store={store}>
        <AuthenticatedAppContainer />
      </Provider>);
  }
}

export default AuthenticatedApp;
