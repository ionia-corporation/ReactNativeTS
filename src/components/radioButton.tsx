import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text } from 'native-base';

import { Styles, Colors} from '../styles/main';

interface RadioObj {
  name: string;
  title: string;
  subTitle?: string;
}

interface Props {
  values: RadioObj[];
  defaulValue: string;
  onChange?: (value: RadioObj) => null;
  disabled?: boolean;
}

interface State {
  activeValue: string;
}

class RadioButtonComponent extends React.Component<Props, State> {
  state: State = {
    activeValue: this.props.defaulValue
  }

  handleRadioButton(value: RadioObj) {
    const { onChange } = this.props;

    this.setState({activeValue: value.name});

    if (onChange) {
      onChange(value);
    }
  }

  render() {
    const { values, disabled } = this.props;
    const { activeValue } = this.state;

    return values.map((value, i) => {
      return (
        <View style={Styles.radioButtonContainer} key={i}>
          <TouchableOpacity disabled={disabled} onPress={() => this.handleRadioButton(value)}>
            <View style={[Styles.radioButtonBorder, disabled && Styles.radioButtonBorderDisabled]}>
              {
                activeValue === value.name &&
                <View style={[Styles.radioButtonCenter, disabled && Styles.radioButtonCenterDisabled]}/>
              }
            </View>
          </TouchableOpacity>

          <Text style={[Styles.radioButtonTitle, disabled && Styles.textDisabled]}>
            { value.title }
          </Text>

          <Text style={[Styles.radioButtonSubtitle, disabled && Styles.textDisabled]}>
            { value.subTitle }
          </Text>
        </View>
      );
    });
  }
}

export const RadioButton = RadioButtonComponent;
