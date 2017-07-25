import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { HomeScreen, SomewhereScreen } from './components/index';
import configureStore from './store/index';

const App = StackNavigator({
    Home: { screen: HomeScreen },
    Add: { screen: SomewhereScreen },
});

configureStore();

export default App;
