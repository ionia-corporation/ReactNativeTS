import React, { Component, ComponentClass } from 'react';
import { Provider } from 'react-redux';
import { Text, Button } from 'react-native';
import { Authenticated } from './components/authenticated';
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


let store = configureStore();
class AuthenticatedApp extends React.Component<void, void> {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>);
  }
}

export default AuthenticatedApp;
