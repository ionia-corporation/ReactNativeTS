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
    const { values } = this.props;
    const { activeValue } = this.state;

    return values.map((value, i) => {
      return (
        <View style={Styles.radioButtonContainer} key={i}>
          <TouchableOpacity onPress={() => this.handleRadioButton(value)}>
            <View style={Styles.radioButtonBorder}>
              {
                activeValue === value.name &&
                <View style={Styles.radioButtonCenter}/>
              }
            </View>
          </TouchableOpacity>

          <Text style={Styles.radioButtonTitle}>
            { value.title }
          </Text>

          <Text style={Styles.radioButtonSubtitle}>
            { value.subTitle }
          </Text>
        </View>
      );
    });
  }
}

export const RadioButton = RadioButtonComponent;
