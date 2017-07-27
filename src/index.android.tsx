import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { HomeScreen, DeviceList, RenewSessionScreen } from './components/index';
import configureStore from './store/index';
import xively from './lib/xively';

const Navigator = StackNavigator({
    Home: { screen: HomeScreen },
    RenewSession: { screen: RenewSessionScreen },
    'Authenticated/DeviceList': { screen: DeviceList },
}, {
    initialRouteName: 'Home',
});

// Check that only authenticated people access paths that start with 'Authenticated/'
const defaultGetStateForAction = Navigator.router.getStateForAction;
Navigator.router.getStateForAction = (action, state) => {
    if (state
        && action.routeName.split('/')[0] === 'Authenticated'
        && !(xively.comm.checkJwtNoRenew())) {
        // un-authenticated, but trying to access something under 'Authenticated/'
        // TODO: TEST that this redirects to login
        return {
            ...state,
            index: 2,
        };
    }
    return defaultGetStateForAction(action, state);
}

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
