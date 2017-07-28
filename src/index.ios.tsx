import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StackNavigator, NavigationActions, NavigationState } from 'react-navigation';
import { HomeScreen, DeviceList, RenewSessionScreen, LoginScreen } from './components/index';
import configureStore from './store/index';
import xively from './lib/xively';

const Navigator = StackNavigator({
    Login: { screen: LoginScreen },
    Home: { screen: HomeScreen },
    'Authenticated/DeviceList': { screen: DeviceList },
});

// Check that only authenticated people access paths that start with 'Authenticated/'
const defaultGetStateForAction = Navigator.router.getStateForAction;
Navigator.router.getStateForAction = (action, state: NavigationState) => {
    if (state
        && action.routeName
        && action.routeName.split('/')[1] === 'Authenticated' // remember, 0 is 'Root'
        && !(xively.comm.checkJwtNoRenew())) {
        // un-authenticated, but trying to access something under 'Authenticated/'
        // TODO: TEST that this redirects to login
        action.params = {
            nextRoute: action.routeName,
            nextRouteParams: action.params,
        }
        action.routeName = 'RenewSession';
        return defaultGetStateForAction(action, state);
    }
    return defaultGetStateForAction(action, state);
}

const Root = StackNavigator({
        Navigator: {
            screen: Navigator,
        },
        RenewSession: {
            screen: RenewSessionScreen,
        }
    }, {
        mode: 'modal',
        headerMode: 'none',
    });

let store = configureStore();

class App extends React.Component<void, void> {
    render() {
        return (
            <Provider store={store}>
                <Root />
            </Provider>);
    }
}

export default App;
