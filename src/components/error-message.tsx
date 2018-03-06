import * as React from 'react';
import { Text, Card, CardItem, Body } from 'native-base';
import { Animated, Easing } from "react-native";

import Styles from '../styles/main';

interface Props {
  error: string;
}

const errInicialPosition = -58;
const errEndPosition = 0;
const errPosition = new Animated.Value(errInicialPosition);

export const ErrorMessage = (props: Props) => {
  const { error } = props;

  const renderError = () => (
    <Animated.View style={{ marginTop: errPosition}}>
      <Card style={Styles.errorContainer}>
        <CardItem>
          <Body>
            <Text style={Styles.errorMessage}>
              { props.error }
            </Text>
          </Body>
        </CardItem>
      </Card>
    </Animated.View>
  );

  if (error) {
    Animated.timing(errPosition, { toValue: errEndPosition, duration: 150, easing: Easing.in(Easing.ease) }).start();
  } else {
    Animated.timing(errPosition, { toValue: errInicialPosition, duration: 150, easing: Easing.out(Easing.ease) }).start();
  }

  return renderError();
};

export default ErrorMessage;
