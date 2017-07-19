import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../store/reducers/index';

import { View, Text, Button } from "react-native";
import Styles from '../styles/main';
import { increment } from '../store/actions/sample';

interface SomewhereScreenReduxProps {
    val: number;
}
interface SomewhereSreenDispatchProps {
    increment: () => any;
}
interface SomewhereScreenProps extends
    React.Props<SomewhereScreenComponent>,
    SomewhereScreenReduxProps,
    SomewhereSreenDispatchProps {
}

function mapStateToProps(state: AppState, ownProps: SomewhereScreenProps) {
    return {
        val: state.sample? state.sample.val : -1,
    }
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: SomewhereScreenProps) {
    return {
        increment: () => dispatch(increment()),
    }
}

export class SomewhereScreenComponent extends React.Component<SomewhereScreenProps, void> {
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
                    onPress={() => this.props.increment()}
                    title='go somewhere' />
                <Text style={Styles.subtitle}>
                    {this.props.val}
                </Text>
            </View>
        );
    }
}

export let SomewhereScreen = connect(mapStateToProps, mapDispatchToProps)(SomewhereScreenComponent);
export default SomewhereScreen;
