import React from 'react';
import { Switch as SwitchBase } from 'native-base';

import { Styles, Colors } from '../styles/main';

interface Props {
  defaultValue?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

interface State {
  switchValue: boolean;
}

class SwitchComponent extends React.Component<Props, State> {
  state: State = {
    switchValue: this.props.defaultValue || false
  }
  
  handleSwitch(value: boolean) {
    const { onChange } = this.props;

    this.setState({switchValue: value});

    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const { switchValue } = this.state;
    const { disabled } = this.props;
    const { neonRed, claret, greyishBrown, middleGray } = Colors;

    return (
      <SwitchBase
        onTintColor={disabled ? greyishBrown : neonRed}
        thumbTintColor={disabled ? middleGray : claret}
        tintColor={disabled ? greyishBrown : neonRed}
        value={switchValue}
        onValueChange={() => this.handleSwitch(!switchValue)}
        style={Styles.switch}
        disabled={disabled}
      />
    );
  }
}

export const Switch = SwitchComponent;
