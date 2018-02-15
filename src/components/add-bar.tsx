import * as React from 'react';
import { View, Button, Text } from 'native-base';
import  Icon  from 'react-native-vector-icons/Ionicons';

import Styles from '../styles/main';

interface Props {}

export const AddBar = (props: Props) => {
  return (
    <View style={Styles.addBarContainer}>
      <Button iconLeft transparent primary style={Styles.addBarButton}>
        <Icon name='md-add-circle' style={Styles.addBarIcon}/>

        <Text style={Styles.addBarText}>ADD DEVICE</Text>
      </Button>

      <Button iconLeft transparent primary style={Styles.addBarButton}>
        <Icon name='md-add-circle' style={Styles.addBarIcon}/>

        <Text style={Styles.addBarText}>ADD GROUP</Text>
      </Button>
    </View>
  );
}

export default AddBar;
