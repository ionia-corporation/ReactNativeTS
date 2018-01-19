import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NavigationScreenConfigProps } from 'react-navigation';
import { View, Text, Button, Image, ScrollView } from "react-native";

import { AppState, DeviceWithData } from '../types/index';
import { Authenticated } from './authenticated';
import { getDevice } from '../store/blueprint/devices/reducers';
import { TopicData } from '../store/mqtt/reducers';
import { topic } from '../store/mqtt/utils';
import { Devices } from '../lib/xively/models/index';
import Styles from '../styles/main';
import xively from '../lib/xively';
import { TimeSeries } from '../lib/xively/models/timeseries';
import { TimeSeriesChart } from './time-series-chart';

interface ReduxStateProps {
  device: DeviceWithData;
}
interface ReduxDispatchProps {
}
interface DeviceProps extends
  React.Props<DeviceScreenComponent>,
  ReduxStateProps,
  ReduxDispatchProps,
  NavigationScreenConfigProps {
}

function mapStateToProps(state: AppState, ownProps: DeviceProps) {
  const device: Devices.Device = getDevice(state, ownProps.navigation.state.params.deviceId);

  let mqttData: { [topicName: string]: TopicData } = {};

  Object.keys(state.mqtt.data).filter((topic) => {
    return topic.split('/')[5] === device.id;
  }).forEach((topic) => {
    mqttData[topic.split('/').slice(6).join('/')] = state.mqtt.data[topic];
  });

  return {
    device:
    { device, mqttData }
  };
}

function mapDispatchToProps(dispatch: Dispatch<AppState>, ownProps: DeviceProps) {
  return {
  }
}

interface DeviceState {
  timeSeries?: Array<TimeSeries.DataPoint> | 'error';
}

export class DeviceScreenComponent extends React.Component<DeviceProps, DeviceState> {
  connectedImage = require('../../images/device_on.png');
  disconnectedImage = require('../../images/device_off.png');

  static navigationOptions = {
    title: 'Device',
  };

  state: DeviceState = {
    timeSeries: null,
  };

  componentDidMount() {
    return this.loadTimeSeries();
  }

  async loadTimeSeries() {
    try {
      this.setState({ timeSeries: null });

      const { result } = await xively.timeseries.getLatestValues({
        deviceId: this.props.device.device.id,
        channel: 'charge-controller',
        pageSize: 100,
      });

      this.setState({ timeSeries: result });
    } catch (err) {
      this.setState({ timeSeries: 'error' });
    }
  }

  render() {
    if (!this.props || !this.props.device || !this.props.device.device) {
      return (
        <View style={Styles.container}>
          <Text style={Styles.title}>
            loading
          </Text>
        </View>
      )
    }

    const { timeSeries } = this.state;

    return (
      <View style={Styles.container}>
        <ScrollView>
          {Object.keys(this.props.device.mqttData).map((topic) => {
            let msg = '<none>';
            const data = this.props.device.mqttData[topic];

            if (data && data.message && data.message.stringPayload) {
              msg = data.message.stringPayload;
            } else if (data && data.messages && data.messages.length && data.messages[0].stringPayload) {
              msg = data.messages[0].stringPayload;
            }

            return (
              <View key={topic}>
                <Text>
                  Topic: {topic}
                </Text>
                <Text>
                  Data: {msg}
                </Text>
              </View>
            )
          })}
        </ScrollView>

        <TimeSeriesChart
          title='Charge Controller'
          description='Last 100 data points from the charge-controller channel.'
          data={ timeSeries }
        />
      </View>
    );
  }
}

export let DeviceScreen = Authenticated(connect(mapStateToProps, mapDispatchToProps)(DeviceScreenComponent));
export default DeviceScreen;
