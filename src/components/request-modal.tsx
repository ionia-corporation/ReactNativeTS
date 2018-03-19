import React from 'react';
import { Modal } from 'react-native';
import { View, Text, Button } from 'native-base'
import { isFunction } from 'lodash';
import  Icon  from 'react-native-vector-icons/Ionicons';

import Styles from '../styles/main';
import { ErrorMessage } from './index';

interface Props {
  // Visibility
  showModal?: boolean;

  // Header
  title?: string;
  subtitle?: string;

  // Buttons
  submitText?: string;
  submitDisabled?: boolean;

  // Callbacks
  onModalClose?: () => void;
  onModalSubmit?: () => void;

  // Error
  error: string;
}

interface State {
  showModal: boolean
}

export class RequestModal extends React.Component<Props, State> {
  state = {
    showModal: false
  }

  componentWillReceiveProps(nextProps: Props) {
    const { showModal } = nextProps;

    if (this.state.showModal !== showModal) {
      this.setState({showModal})
    } 
  }

  handleSubmit() {
    const { onModalSubmit } = this.props;

    if (isFunction(onModalSubmit)) {
      return onModalSubmit();
    }
  }

  handleClose() {
    const { onModalClose } = this.props;

    if (isFunction(onModalClose)) {
      return onModalClose();
    }

    this.setState({showModal: false});
  }
 
  render() {
    const { title, subtitle, submitText, children, submitDisabled, error } = this.props;
    const { showModal } = this.state;

    return (
      <Modal
        animationType='slide'
        transparent
        visible={showModal}>
        <View style={Styles.modal}>
          <Button
            style={Styles.modalCloseButton}
            transparent
            onPress={() => this.handleClose()}>
            <Icon style={Styles.modalCloseIcon} name='md-close'/>
          </Button>

          <View style={Styles.modalContent}>
  
            <View>
              <Text style={Styles.modalTitle}>{ title }</Text>

              <Text style={Styles.modalSubtitle}>{ subtitle }</Text>

              <View>
                { children }
              </View>

              <Button
                style={Styles.modalButton}
                rounded
                disabled={submitDisabled}
                onPress={() => this.handleSubmit()}>
                <Text>{ submitText }</Text>
              </Button>
            </View>
            <View>
              <Text style={Styles.modalSubtitle}>{error} </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default RequestModal;
