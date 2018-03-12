import * as React from 'react';
import { Text, Card, CardItem, Body } from 'native-base';
import { Animated, Easing } from "react-native";

import Styles from '../styles/main';

interface Props {
  error: string;
}

const errInicialPosition = -58;
const errEndPosition = 0;
const errPositionDuration = 150;

const errInitialOpacity = 0;
const errEndOpacity = 1;
const errOpacityDuration = 0;

interface State {
  errOpacity: Animated.Value;
  errPosition: Animated.Value;
}

export class ErrorMessage extends React.Component <Props, State> {
  state = {
    errOpacity: new Animated.Value(errInitialOpacity),
    errPosition: new Animated.Value(errInicialPosition)
  }

  shouldComponentUpdate(nextProps: Props) {
    const { error } = this.props
    const { error: nextError } = nextProps;

    return !(!error && !nextError) && (error !== nextError);
  }

  componentDidUpdate(prevProps) {
    const { prevError } = prevProps;
    const { error } = this.props;
    const { errOpacity, errPosition } = this.state;
    if (!prevError && error) {
      Animated.timing(errOpacity, {
        toValue: errEndOpacity,
        duration: errOpacityDuration
      }).start(() =>
        Animated.timing(errPosition, {
          toValue: errEndPosition,
          duration: errPositionDuration,
          easing: Easing.in(Easing.ease)
        }).start()
      );
    }
  }

  componentWillUnmount() {
    this.setState({
      errOpacity: new Animated.Value(errInitialOpacity),
      errPosition: new Animated.Value(errInicialPosition)
    })
  }

  render() {
    const { errOpacity, errPosition } = this.state;

    return (
      <Animated.View style={{ marginTop: errPosition, opacity: errOpacity}}>
        <Card style={Styles.errorContainer}>
          <CardItem>
            <Body>
              <Text style={Styles.errorMessage}>
                { this.props.error }
              </Text>
            </Body>
          </CardItem>
        </Card>
      </Animated.View>
    );
  }
};

export default ErrorMessage;
