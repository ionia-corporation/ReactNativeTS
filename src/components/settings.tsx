import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Container, Content, List, ListItem, Text, Right, Body, Switch, CheckBox, View } from 'native-base';

import { HeaderComponent } from './index';
import { Styles, Colors} from '../styles/main';

interface State {
  switchValue: boolean;
  checkBoxValues: string[];
  checkBoxCheckedValue: string;
}

class SettingsComponent extends React.Component<any, State> {
  state: State = {
    switchValue: false,
    checkBoxValues: ['F˚', 'C˚'],
    checkBoxCheckedValue: 'F˚'
  }

  render() {
    const { switchValue, checkBoxValues, checkBoxCheckedValue } = this.state;

    return (
      <Container style={Styles.viewContainer}>
        <HeaderComponent title='Settings'/>

        <Content>
          <List>
          <ListItem style={[Styles.listItem, Styles.listItemGroup]}>
              <Body>
                <Text
                  numberOfLines={1}
                  style={[Styles.listItemTitle, Styles.settingsListItemTitle]}
                >TEMPERATURE</Text>
              </Body>

              <Right>
                <View style={Styles.settingsListItemCheckbox}>
                  {
                    checkBoxValues.map((value, i) => {
                      return (
                        <View style={Styles.checkBoxContainer} key={i}>
                          <CheckBox
                            checked={value === checkBoxCheckedValue}
                            color={Colors.neonRed}
                            onPress={() => this.setState({checkBoxCheckedValue: value})}
                          />

                          <Text style={Styles.checkBoxText}>{value}</Text>
                        </View>
                      );
                    })
                  }
                </View>
              </Right>
            </ListItem>

            <ListItem style={[Styles.listItem, Styles.listItemGroup]}>
              <Body>
                <Text
                  numberOfLines={1}
                  style={[Styles.listItemTitle, Styles.settingsListItemTitle]}
                >PUSH NOTIFICATIONS</Text>
              </Body>

              <Right>
                <Switch
                  onTintColor={Colors.neonRed}
                  thumbTintColor={Colors.claret}
                  tintColor={Colors.neonRed}
                  value={switchValue}
                  onValueChange={() => this.setState({switchValue: !switchValue})}
                  style={Styles.switch}/>
              </Right>
            </ListItem>

            <ListItem style={[Styles.listItem]}>
              <Body>
                <View style={Styles.settingsListItemRadio}>
                  <View style={Styles.radioButtonContainer}>
                    <TouchableOpacity>
                      <View style={Styles.radioButtonBorder}>
                        <View style={Styles.radioButtonCenter}>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <Text style={Styles.radioButtonTitle}>
                      High Temp
                    </Text>

                    <Text style={Styles.radioButtonSubtitle}>
                      Alert me when indoor temp is above 80˚
                    </Text>
                  </View>

                  <View style={Styles.radioButtonContainer}>
                    <TouchableOpacity>
                      <View style={Styles.radioButtonBorder}>
                      </View>
                    </TouchableOpacity>

                    <Text style={Styles.radioButtonTitle}>
                      Low Temp
                    </Text>

                    <Text style={Styles.radioButtonSubtitle}>
                      Alert me when indoor temp is above 60˚
                    </Text>
                  </View>

                  <View style={Styles.radioButtonContainer}>
                    <TouchableOpacity>
                      <View style={Styles.radioButtonBorder}>
                      </View>
                    </TouchableOpacity>

                    <Text style={Styles.radioButtonTitle}>
                      Outdoor Temp
                    </Text>

                    <Text style={Styles.radioButtonSubtitle}>
                      Alert me when outdoor temp is above 97˚ or below 20˚
                    </Text>
                  </View>
                </View>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export const Settings = SettingsComponent;