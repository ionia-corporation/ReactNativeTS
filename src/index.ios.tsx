import React, { Component, ComponentClass } from 'react';
import { Provider } from 'react-redux';
import { Text, Button } from 'react-native';
import { App } from './components/app';
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
  DeviceList,
  DeviceScreen,
  LoginScreen,
  SignUp,
  NavTabs,
  Settings,
  Account,
  Help
} from './components/index';
import { store } from './store/configure-store';
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

export const SignedOut = StackNavigator({
  SignUp: {
    screen: SignUp,
  },
  Login: {
    screen: LoginScreen,
  }
},
{
  initialRouteName: 'Login',
  headerMode: 'none'
});

const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: MainNavigation,
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

class AuthenticatedApp extends React.Component<void, void> {
  render() {
    return (
      <Provider store={store}>
        <App createRootNavigator={createRootNavigator}/>
      </Provider>);
  }
}

export default AuthenticatedApp;