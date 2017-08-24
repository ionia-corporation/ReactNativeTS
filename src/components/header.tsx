import * as React from 'react';
import { View, Text, Button } from "react-native";
import Styles from '../styles/main';
import { NavigationScreenConfigProps } from 'react-navigation';

export function headerRight(navigation: any) {

    return (
        <Button
            onPress={() => navigation.navigate('DrawerOpen')}
            title='... ' />
    );
}

export default headerRight;
