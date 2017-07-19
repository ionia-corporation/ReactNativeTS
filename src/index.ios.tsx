import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import { HomeScreen, SomewhereScreen } from './components/index';
import configureStore from './store/index';

const Navigator = StackNavigator({
    Home: { screen: HomeScreen },
    Add: { screen: SomewhereScreen },
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
