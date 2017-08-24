import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Text, Button } from 'react-native';
import {
    HeaderProps,
    DrawerNavigator,
    DrawerNavigatorConfig,
    StackNavigator,
    StackNavigatorConfig,
    NavigationActions,
    NavigationState
} from 'react-navigation';
import { HomeScreen, DeviceList, LoginScreen, LogoutScreen, headerRight } from './components/index';
import configureStore from './store/configure-store';
import xively from './lib/xively';

const DevicesNavigator = StackNavigator({
    DeviceList: {
        screen: DeviceList,
        navigationOptions: ({ navigation }) => ({
            drawerLabel: 'Devices',
            headerRight: headerRight(navigation),
        }),
    },
})

const Navigator = DrawerNavigator({
    Devices: {
        screen: DevicesNavigator,
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            drawerLabel: '',
        },
    },
    Logout: {
        screen: LogoutScreen,
        navigationOptions: {
            drawerLabel: 'Logout',
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
