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
    NavigationState,
    TabNavigator
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
    headerRight,
    SignUp
} from './components/index';
import configureStore from './store/configure-store';
import xively from './lib/xively';

const GroupsTabNavigation = TabNavigator({
    SubGroups: {
        screen: SubGroupsScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Sub Groups',
            headerRight: headerRight(navigation),
        })
    },
    GroupDevices: {
        screen: GroupDevices,
        navigationOptions: ({ navigation }) => ({
            title: 'Devices',
            headerRight: headerRight(navigation),
        })
    },
});

const GroupsNavigator = StackNavigator({
    GroupList: {
        screen: GroupList,
        navigationOptions: ({ navigation }) => ({
            title: 'Groups',
            headerRight: headerRight(navigation),
        }),
    },
    Group: {
        screen: GroupsTabNavigation,
        navigationOptions: ({ navigation }) => ({
            title: navigation.state.params.groupName,
            headerRight: headerRight(navigation),
        })
    }
});

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
});

const Navigator = DrawerNavigator({
    Devices: {
        screen: DevicesNavigator,
    },
    Groups: {
        screen: GroupsNavigator,
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

const RootNavigator = StackNavigator({
    Drawer: {
        name: 'Drawer',
        screen: Navigator,
    },
    SignUp: {
        screen: SignUp,
    }
},
{
    headerMode: 'none'
});

let store = configureStore();

class App extends React.Component<void, void> {
    render() {
        return (
            <Provider store={store}>
                <RootNavigator />
            </Provider>);
    }
}

export default App;
