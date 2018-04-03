import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Container, Content, List, ListItem, Text, Right, Body, View } from 'native-base';

import { HeaderComponent, Switch, CheckBox, RadioButton } from './index';
import { Styles, Colors} from '../styles/main';


class SettingsComponent extends React.Component<any, any> {
  render() {
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
                  <CheckBox
                    values={['F˚', 'C˚']}
                    defaultValue='F˚'
                  />
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
                <Switch defaultValue/>
              </Right>
            </ListItem>

            <ListItem style={[Styles.listItem]}>
              <Body>
                <View style={Styles.settingsListItemRadio}>
                  <RadioButton
                    values={[
                      {name:'highTemp', title:'High Temp', subTitle: 'Alert me when indoor temp is above 80˚'},
                      {name:'lowTemp', title:'Low Temp', subTitle: 'Alert me when indoor temp is above 60˚'},
                      {name:'outdoorTemp', title:'Outdoor Temp', subTitle: 'Alert me when outdoor temp is above 97˚ or below 20˚'}
                    ]}
                    defaulValue='highTemp'
                  />
                </View>
              </Body>
            </ListItem>

            <ListItem style={[Styles.listItem, Styles.listItemGroup]}>
              <Body>
                <Text
                  numberOfLines={1}
                  style={[Styles.listItemTitle, Styles.settingsListItemTitle, {color: Colors.greyishBrown}]}
                >EMAIL NOTIFICATIONS</Text>
              </Body>

              <Right>
                <Switch disabled/>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export const Settings = SettingsComponent;