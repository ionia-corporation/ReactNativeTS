import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { HomeScreen, Somewhere } from './components/index';

const App = StackNavigator({
    Home: { screen: HomeScreen },
    Add: { screen: Somewhere },
});

export default App;
