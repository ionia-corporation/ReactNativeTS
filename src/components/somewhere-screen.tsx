import * as React from 'react';
import { View, Text, Button } from "react-native";
import Styles from '../styles/main';
import { NavigationScreenConfigProps } from 'react-navigation';

interface SomewhereProps extends
    React.Props<SomewhereScreen>,
    NavigationScreenConfigProps {
}
interface SomewhereState {
}

export class SomewhereScreen extends React.Component<SomewhereProps, SomewhereState> {
    static navigationOptions = {
        title: 'Somewhere',
    };
    render() {
        return (
            <View style={Styles.container}>
                <Text style={Styles.title}>
                    Somewhere
                </Text>
                <Button
                    onPress={() => this.props.navigation.navigate('Add')}
                    title='go somewhere' />
            </View>
        );
    }
}

export default SomewhereScreen;
