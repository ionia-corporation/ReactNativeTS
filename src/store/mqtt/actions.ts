import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';
import * as redux from 'redux';
import { cloneDeep, values } from 'lodash';
import xively from '../../lib/xively';
import { Device, AppState } from '../../types';
import { constants, MqttState, serdes, ActionRestoreSubscriptionState } from './reducers';
import { parseTopic } from './utils';
import { ChannelType, MqttMessage, TopicData } from './types';

// TODO use a config param
const MQTT_HOST = 'broker.xively.com';

let client: Paho.MQTT.Client;

let handlers: { [eventName: string]: any } = {};

type GetState = () => AppState;
type Dispatch = redux.Dispatch<AppState>;

export function connect() {
  return async function(dispatch: Dispatch, getState: GetState) {

// init MQTT storage
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      sync: {
      }
    });

    const state = getState();

    // TODO: paho doesn't seem to have this status field
    // if (client || state.mqtt.connected) {
    //   throw new Error(`MQTT: attempting to connect while already connected`);
    // }

    let jwt;
    try {
      jwt = await xively.comm.getCurrentJwt();
      console.log('jwt', jwt);
    } catch (e) {
      console.log('MQTT: Problem while getting the jwt', e);
      dispatch(setError(`Error with your session please try to log in again`));
      return;
    }

    client = new Paho.MQTT.Client(MQTT_HOST, 443, '', '');

    dispatch(connecting());

    // This is one of the most complex things in the code,
    // the main purpose of this logic is to try to auto-reconnect after disconnecting.
    // BUT, we cannot let mqtt.js handle this automatically for us, because our password
    // (jwt) changes every few minutes (because that's why the session get's renewed and extended)
    // so need to hijack the reconnection mechanism provided by mqtt.js, abort it (disconnect) and
    // re initiate the connection ourselves, by dispatching(connect) recursively.
    //
    // Probably this whole thing would benefit from some refactor if you are up for it.
    // TODO:
    // - crate hooks so when the user logs out this is stopped
    const reconnect = async () => {
      dispatch({ type: constants.RECONNECTING });
      // save state.mqtt.data
      const subscriptions = cloneDeep(getState().mqtt.data);
      // disconnect
      await dispatch(disconnect());
      // connect
      await dispatch(connect());
      // re subscribe mqtt
      client.subscribe(Object.keys(subscriptions), (error, granted) => {
        if (error) {
          dispatch(setError(error.message));
          console.log(`MQTT: something went wrong while subscribing`, error);
          return;
        }
      });
      // restore state.mqtt.data
      dispatch(restoreSubscriptionState(subscriptions));
    };

    handlers['onConnected'] = () => dispatch({ type: constants.CONNECTED });
    handlers['onConnectionLost'] = reconnect;
    handlers['onMessageArrived'] = (message: MqttMessage) => dispatch(onMessage(message.destinationName, message.payloadString));

    Object.keys(handlers).forEach((eventName) => {
      client[eventName] = handlers[eventName];
    })

    client.connect({
      userName: 'Auth:JWT',
      password: jwt,
      onSuccess: () => dispatch({ type: constants.CONNECTED }),
      onFailure: (err) => dispatch(setError(`Something went wrong: ${JSON.stringify(err)}`)),
      useSSL: true,
    });
  };
}

export function disconnect() {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state = getState();
    if (!state.mqtt.connected) {
      console.log(`MQTT ERROR: attempting to disconnect while already disconnected`);
      return;
    }

    Object.keys(handlers).forEach((eventName) => {
      client[eventName] = null;
    });

    client.end(true);

    dispatch(notConnected());
    await dispatch(unsubscribeAll());
    client = null;
  };
}

export function subscribeDevice(device: Device) {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state: MqttState = getState().mqtt;
    const subscriptions = values(state.data);
    const notSubscribedTopics = (channel) => !(subscriptions as any).includes(channel.channel);

    const topicsToSubscribe = device.channels
      .filter(notSubscribedTopics)
      .map((channel) => ({
        topic: channel.channel,
        channelType: channel.persistenceType,
      }));
      topicsToSubscribe.forEach((topic) => {
        client.subscribe(topic.topic, {
          onFailure: (err) => {
            dispatch(setError(err.errorMessage));
            console.log(`MQTT: something went wrong while subscribing`, err.errorMessage);
          },
        });
      });

    // TODO: make sure we got the ack on the subscribes
    dispatch(subscribed(topicsToSubscribe));

    // TODO: figure out how to mimic this functionality from MQTTJS
    // client.subscribe(topicsToSubscribe.map((channel) => channel.topic), (error, granted) => {
    //   if (error) {
    //     dispatch(setError(error.message));
    //     console.log(`MQTT: something went wrong while subscribing`, error);
    //     return;
    //   }

    //   const failedTopics = granted
    //     .filter((grant) => grant.qos === 128)
    //     .map((grant) => grant.topic);

    //   failedTopics.forEach((topic) => {
    //       console.warn(`MQTT subscription denied for ${topic}`);
    //     });

    //   const successfulySubscribedTopics = topicsToSubscribe
    //     .filter((topicConfig) => !(failedTopics as any).includes(topicConfig.topic));

    //   dispatch(subscribed(successfulySubscribedTopics));
    // });
  };
}

export function unsubscribeDevice(device: Device) {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state: MqttState = getState().mqtt;
    const subscriptions = values(state.data);
    const subscribedTopics = (channel) => !(subscriptions as any).includes(channel.channel);

    const topicsToUnsubscribe = device.channels.filter(subscribedTopics).map((channel) => channel.channel);
    client.unsubscribe(topicsToUnsubscribe);
    dispatch(unsubscribed(topicsToUnsubscribe));
  };
}


export function unsubscribeAll() {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state: MqttState = getState().mqtt;
    const topics = Object.keys(state.data);
    client.unsubscribe(topics);
    dispatch(unsubscribed(topics));
  };
}


export function onMessage(topic: string, message: string) {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state: MqttState = getState().mqtt;
    const channelType = state.data[topic].channelType;
    const payload = {
      topic,
      channelType,
      stringPayload: message,
    };


    dispatch({
      type: constants.MESSAGE,
      payload,
    });
  };
}


export function send<T>(topic: string, payload: T, qos: number, retained: boolean) {
  return async function(dispatch: Dispatch, getState: GetState) {
    let channel;
    try {
      channel = parseTopic(topic).channel;
    } catch (err) {
      console.warn(`MQTT: bad topic ${topic}, ignoring`);
      return;
    }

    let stringifier;
    try {
      stringifier = serdes[channel].stringify;
    } catch (err) {
      console.warn(`MQTT: stringifier not found for channel ${channel}, ignoring`);
      return;
    }

    client.publish(topic, stringifier(payload), qos, retained);
  };
}

export function restoreSubscriptionState(prevState: { [topicName: string]: TopicData }) {
  return {
    type: constants.RESTORE_SUBSCRIPTION_STATE,
    payload: prevState as ActionRestoreSubscriptionState,
  };
}

export function subscribed(topics: Array<{topic: string, channelType: ChannelType}>) {
  return {
    type: constants.SUBSCRIBED_TO_TOPICS,
    payload: topics,
  };
}

export function unsubscribed(topics: Array<string>) {
  return {
    type: constants.UNSUBSCRIBED_TO_TOPICS,
    payload: topics,
  };
}

export function connecting() {
  return {
    type: constants.CONNECTING,
  };
}



export function notConnected() {
  return {
    type: constants.NOT_CONNECTED,
  };
}



export function setError(error: string) {
  return {
    type: constants.ERROR,
    payload: error,
  };
}
