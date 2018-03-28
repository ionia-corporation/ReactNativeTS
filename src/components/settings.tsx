import React from 'react';
import { Container, Content, List, ListItem, Text, Right, Body, Switch, Radio, View } from 'native-base';

import { HeaderComponent } from './index';
import Styles from '../styles/main';

interface State {
  switchValue: boolean;
}

class SettingsComponent extends React.Component<any, State> {
  state: State = {
    switchValue: false
  }
  render() {
    const { switchValue } = this.state;

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
                <View style={{backgroundColor: '#fb0240', borderRadius: 50, padding: 10}}>
                  <Radio selected={true}/>
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
                <Switch onTintColor={'#fb0240'} thumbTintColor={'#6c001b'} tintColor={'#fb0240'} value={switchValue} onValueChange={() => this.setState({switchValue: !switchValue})} style={Styles.switch}/>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

export const Settings = SettingsComponent;