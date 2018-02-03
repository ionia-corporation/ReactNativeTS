import React from 'react';
import { NavigationScreenConfigProps, NavigationState } from 'react-navigation';
import { Button, Text, Icon, Footer, FooterTab } from 'native-base';

interface Props extends NavigationScreenConfigProps {
  navigationState: NavigationState;
  jumpToIndex: Function;
}

export class NavTabs extends React.Component<Props> {
  render() {
    const { navigation, navigationState, jumpToIndex } = this.props;

    return (
      <Footer>
        <FooterTab>
          <Button
            vertical
            active={navigationState.index === 0}
            onPress={() => {
              if (navigationState.index !== 0) {
                jumpToIndex(0);
              }
            }}>

            <Text>Devices</Text>
          </Button>

          <Button
            vertical
            active={navigationState.index === 1}
            onPress={() => {
              if (navigationState.index !== 1) {
                jumpToIndex(1);
              }
            }}>

            <Text>Settings</Text>
          </Button>

          <Button
            vertical
            active={navigationState.index === 2}
            onPress={() => {
              if (navigationState.index !== 2) {
                jumpToIndex(2);
              }
            }}>

            <Text>Account</Text>
          </Button>

          <Button
            vertical
            active={navigationState.index === 3}
            onPress={() => {
              if (navigationState.index !== 3) {
                jumpToIndex(3);
              }
            }}>

            <Text>Help</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

export default NavTabs;
