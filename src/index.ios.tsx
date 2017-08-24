import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Text, Button } from 'react-native';
import {
    HeaderProps,
    DrawerNavigator,
    DrawerNavigatorConfig,
    NavigationActions,
    NavigationState
} from 'react-navigation';
import { HomeScreen, DeviceList, LoginScreen, LogoutScreen } from './components/index';
import configureStore from './store/configure-store';
import xively from './lib/xively';

const Navigator = DrawerNavigator({
    DeviceList: {
        screen: DeviceList,
        navigationOptions: {
            drawerLabel: 'Devices',
        },
    },
    Logout: {
        screen: LogoutScreen,
        navigationOptions: {
            drawerLabel: 'Logout',
        },
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            drawerLabel: '',
        },
    },
});

let store = configureStore();

class App extends React.Component<void, void> {
    render() {
        return (
            <Provider store={store}>
                <Navigator />
            </Provider>);
    }
}

export default App;
