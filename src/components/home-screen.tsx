import * as React from 'react';
import { View, Text, Button } from "react-native";
import Styles from '../styles/main';
import { NavigationScreenConfigProps } from 'react-navigation';

interface HomeProps extends
    React.Props<HomeScreen>,
    NavigationScreenConfigProps {
}
interface HomeState {
}

export class HomeScreen extends React.Component<HomeProps, HomeState> {
    static navigationOptions = {
        title: 'Home',
    };
    render() {
        return (
            <View style={Styles.container}>
                <Text style={Styles.title}>
                    TITLE HERE
                </Text>
                <Button
                    onPress={() => this.props.navigation.navigate('Add')}
                    title='go somewhere' />
            </View>
        );
    }
}

export default HomeScreen;
