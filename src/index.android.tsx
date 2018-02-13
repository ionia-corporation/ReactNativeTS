import React, { Component, ComponentClass } from 'react';
import { Provider } from 'react-redux';
import { Text, Button } from 'react-native';
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
}, {
  initialRouteName: 'TabsNavigation',
  headerMode: 'none'
});

const RootNavigator = StackNavigator({
  App: {
    screen: MainNavigation
  },
  SignUp: {
    screen: SignUp
  },
  Login: {
    screen: LoginScreen
  },
}, {
  initialRouteName: 'App',
  headerMode: 'none'
});

let store = configureStore();

class App extends React.Component<void, void> {
  render() {
    return (
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    );
  }
}

export default App;
