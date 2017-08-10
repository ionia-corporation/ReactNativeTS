import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StackNavigator, StackNavigatorConfig, NavigationActions, NavigationState } from 'react-navigation';
import { HomeScreen, DeviceList, LoginScreen } from './components/index';
import configureStore from './store/configure-store';
import xively from './lib/xively';

const Navigator = StackNavigator({
    DeviceList: { screen: DeviceList },
    Login: { screen: LoginScreen },
    Home: { screen: HomeScreen },
}, {
    initialRouteName: 'DeviceList',
    headerMode: 'none',
} as StackNavigatorConfig);

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
