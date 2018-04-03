import React from 'react';
import { View, Text, CheckBox as CheckBoxBase } from 'native-base';

import { Styles, Colors } from '../styles/main';

interface Props {
  values: string[];
  defaultValue: string;
  onChange?: (newValue: string) => void;
}

interface State {
  checkedValue: string;
}

class CheckBoxComponent extends React.Component<Props, State> {
  state: State = {
    checkedValue: this.props.defaultValue
  }

  handleCheckBox(value: string) {
    const { onChange } = this.props;

    this.setState({checkedValue: value});

    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const { values } = this.props;
    const { checkedValue } = this.state;

    return values.map((value, i) => {
      return (
        <View style={Styles.checkBoxContainer} key={i}>
          <CheckBoxBase
            checked={value === checkedValue}
            color={Colors.neonRed}
            onPress={() => this.handleCheckBox(value)}
          />

          <Text style={Styles.checkBoxText}>{value}</Text>
        </View>
      );
    })
  }
}

export const CheckBox = CheckBoxComponent;
