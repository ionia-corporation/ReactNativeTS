import * as React from 'react';
import { View, Text, Button } from "react-native";
import Styles from '../styles/main';
import { NavigationScreenProp, NavigationRoute, NavigationStackAction } from 'react-navigation';

// TODO: seems to be a bug in the typings that requires us
//       declaring this parameter as 'any' right now.
export function headerRight(navigation: any) {

    return (
        <Button
            onPress={() => navigation.navigate('DrawerOpen')}
            title='... ' />
    );
}

export default headerRight;
