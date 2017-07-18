import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { HomeScreen, SomewhereScreen } from './components/index';

const App = StackNavigator({
    Home: { screen: HomeScreen },
    Add: { screen: SomewhereScreen },
});

export default App;
