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
import {
    HomeScreen,
    DeviceList,
    DeviceScreen,
    LoginScreen,
    LogoutScreen,
    headerRight,
    SignUp
} from './components/index';
import configureStore from './store/configure-store';
import xively from './lib/xively';

const DevicesNavigator = StackNavigator({
    DeviceList: {
        screen: DeviceList,
        navigationOptions: ({ navigation }) => ({
            title: 'Devices',
            headerRight: headerRight(navigation),
        }),
    },
    Device: {
        screen: DeviceScreen,
        navigationOptions: ({ navigation }) => ({
            title: navigation.state.params.deviceName,
            headerRight: headerRight(navigation),
        })
    }
})

const Navigator = DrawerNavigator({
    Devices: {
        screen: DevicesNavigator,
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
            title: '',
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
