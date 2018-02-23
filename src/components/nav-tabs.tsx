import React from 'react';
import { NavigationScreenConfigProps, NavigationState } from 'react-navigation';
import { Button, Text, Footer, FooterTab } from 'native-base';
import  IconIon  from 'react-native-vector-icons/Ionicons';
import  IconMCI  from 'react-native-vector-icons/MaterialCommunityIcons';

import { Styles, Colors } from '../styles/main';

interface Props extends NavigationScreenConfigProps {
  navigationState: NavigationState;
  jumpToIndex: Function;
}

export class NavTabs extends React.Component<Props> {
  changeTab(nextTab: number) {
    const { jumpToIndex } = this.props
    const { index } = this.props.navigationState;

    if (index !== nextTab) {
      jumpToIndex(nextTab);
    }
  }

  setActive(currentTab: number) {
    const { index } = this.props.navigationState;

    return index === currentTab ? Colors.white : Colors.gray;
  }

  render() {
    const { navigation, navigationState, jumpToIndex } = this.props;
    const { index } = navigationState;

    return (
      <Footer>
        <FooterTab style={Styles.footerTab}>
          <Button
            vertical
            onPress={() => this.changeTab(0)}>

            <IconMCI
              name='television-guide'
              style={{color: this.setActive(0), fontSize: 30}}
            />
          </Button>

          <Button
            vertical
            onPress={() => this.changeTab(1)}>

            <IconIon
              name='md-settings'
              style={{color: this.setActive(1), fontSize: 30}}
            />
          </Button>

          <Button
            vertical
            onPress={() => this.changeTab(2)}>

            <IconIon
              name='ios-person'
              style={{color: this.setActive(2), fontSize: 40}}
            />
          </Button>

          <Button
            vertical
            onPress={() => this.changeTab(3)}>

            <IconIon
              name='md-information-circle'
              style={{color: this.setActive(3), fontSize: 30}}
            />
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export default NavTabs;
