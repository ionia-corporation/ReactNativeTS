import * as mqtt from 'mqtt/mqttClient';
import * as redux from 'redux';
import { cloneDeep, values } from 'lodash';

import xively from '../../lib/xively';
import { Device, AppState, Channel } from '../../types';
import {
  constants,
  MqttState,
  serdes,
  ActionMessagePayload,
  ActionSubscribePayload,
  ActionUnsubscribePayload,
  ActionRestoreSubscriptionStatePayload,
  ActionErrorPayload,
} from './reducers';
import { parseTopic } from './utils';
import { ChannelType, MqttMessage, TopicData } from './types';

// TODO use a config param
const MQTT_HOST = 'wss://broker.xively.com:443/';
const MAX_DELAY = 60 * 1000;

let client;

let handlers = {};

type GetState = () => AppState;
type Dispatch = redux.Dispatch<AppState>;

export function connect() {
  return async function(dispatch: Dispatch, getState: GetState) {
    dispatch({ type: constants.CONNECT_START });
    const state = getState();
    if (client || state.mqtt.connected) {
      throw new Error(`MQTT: attempting to connect while already connected`);
    }

    let jwt;
    try {
      jwt = await xively.comm.getCurrentJwt();
      console.log('jwt', jwt);
    } catch (e) {
      console.log('MQTT: Problem while getting the jwt', e);
      dispatch(setError(`Error with your session please try to log in again`));
      return;
    }

    client = mqtt.connect(MQTT_HOST, {
      username: 'Auth:JWT',
      password: jwt,
    });

    try {
      await new Promise((resolve, reject) => {
        client.on('connect', resolve);
        client.on('error', reject);
      });
    } catch (err) {
      dispatch(setError(`Something went wrong: ${err}`));
      dispatch({ type: constants.CONNECT_END });
      throw err;
    }

    dispatch({ type: constants.CONNECTED });

    client.on('error', (err: any) => dispatch(setError(`Parsing error: ${err}`)));
    client.on('close', () => dispatch({ type: constants.CLOSE }));
    client.on('offline', () => dispatch({ type: constants.OFFLINE }));
    client.on('reconnect', () => dispatch(reconnect()));
    client.on('message', (topic: string, message: MqttMessage) =>
      dispatch(handleMessage(topic, message)));

    dispatch({ type: constants.CONNECT_END });
  };
}


// This is one of the most complex things in the code,
// the main purpose of this logic is to try to auto-reconnect after disconnecting.
// BUT, we cannot let mqtt.js handle this automatically for us, because our password
// (jwt) changes every few minutes (because that's why the session get's renewed and extended)
// so need to hijack the reconnection mechanism provided by mqtt.js, abort it (disconnect) and
// re initiate the connection ourselves, by dispatching(connect) recursively.
export function reconnect() {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state = getState().mqtt;
    if (state.disconnecting) {
      return;
    }

    dispatch({ type: constants.RECONNECT_START });
    // save state.mqtt.data
    const subscriptions = cloneDeep(state.data);
    client.end(true);
    client = null;
    dispatch({ type: constants.NOT_CONNECTED });

    // Exponential backoff
    let delay = 500 * Math.pow(2, state.reconnectCount);
    if (delay > MAX_DELAY) {
      delay = MAX_DELAY;
    }
    setTimeout(
      async () => {
        try {
          await dispatch(connect());
        } catch (err) {
          dispatch(restoreSubscriptionState(subscriptions));
          dispatch({ type: constants.RECONNECT_END });
          // This recursive call only happens when a long disconnection happens
          dispatch(reconnect());
          return;
        }
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
        dispatch({ type: constants.RECONNECT_END });
      },
      delay,
    );
  };
}

export function disconnect() {
  return async function(dispatch: Dispatch, getState: GetState) {
    dispatch({ type: constants.DISCONNECT_START });
    const state = getState();
    if (!client || !state.mqtt.connected) {
      console.log(`MQTT: attempting to disconnect while already disconnected`);
      return;
    }

    client.end(true);
    dispatch({ type: constants.NOT_CONNECTED });
    // cleanup state, remove subscritions
    dispatch({ type: constants.INITIAL_STATE });
    client = null;
    dispatch({ type: constants.DISCONNECT_END });
  };
}

interface SubscribeDeviceInterface {
  channels?: Array<Channel>;
}

export function subscribeDevice(device: SubscribeDeviceInterface) {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state: MqttState = getState().mqtt;
    const subscriptions = values(state.data);
    const notSubscribedTopics = (channel: Channel) => !(subscriptions as any).includes(channel.channel);

    const topicsToSubscribe = (device.channels || [])
      .filter(notSubscribedTopics)
      .map((channel) => ({
        topic: channel.channel,
        channelType: channel.persistenceType,
      }));

    client.subscribe(topicsToSubscribe.map((channel) => channel.topic), (error, granted) => {
      if (error) {
        dispatch(setError(error.message));
        console.log(`MQTT: something went wrong while subscribing`, error);
        return;
      }

      const failedTopics = granted
        .filter((grant) => grant.qos === 128)
        .map((grant) => grant.topic);

      failedTopics.forEach((topic) => {
          console.error(`MQTT subscription denied for ${topic}`);
        });

      const successfulySubscribedTopics = topicsToSubscribe
        .filter((topicConfig) => !(failedTopics as any).includes(topicConfig.topic));

      dispatch(subscribed(successfulySubscribedTopics));
    });
  };
}

export function unsubscribeDevice(device: Device) {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state: MqttState = getState().mqtt;
    const subscriptions = values(state.data);
    const subscribedTopics = (channel: Channel) => !(subscriptions as any).includes(channel.channel);
    const topicsToUnsubscribe = device.channels.filter(subscribedTopics).map((channel) => channel.channel);
    client.unsubscribe(topicsToUnsubscribe);
    dispatch(unsubscribed(topicsToUnsubscribe));
  };
}

export function handleMessage(topic: string, message: MqttMessage) {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state = getState();
    const mqttState = state.mqtt;
    const channelType = mqttState.data[topic].channelType;
    const payload = {
      topic,
      channelType,
      // give access to the parsers to the app state
      appState: state,
      stringPayload: message.toString(),
    } as ActionMessagePayload;

    dispatch({
      type: constants.MESSAGE,
      payload,
    });
  };
}

export function send<T>(topic: string, payload: T, options: object = { qos: 0 }) {
  return async function(dispatch: Dispatch, getState: GetState) {
    let channel;
    try {
      channel = parseTopic(topic).channel;
    } catch (err) {
      console.error(`MQTT: bad topic ${topic}, ignoring`);
      return;
    }

    let stringifier;
    try {
      stringifier = serdes[channel].stringify;
    } catch (err) {
      console.error(`MQTT: stringifier not found for channel ${channel}, ignoring`);
      return;
    }

    client.publish(topic, stringifier(payload), options, (err) => {
      if (err) {
        dispatch(setError(err.message));
      }
    });
  };
}

export function restoreSubscriptionState(prevState: { [topicName: string]: TopicData }) {
  return {
    type: constants.RESTORE_SUBSCRIPTION_STATE,
    payload: prevState as ActionRestoreSubscriptionStatePayload,
  };
}

export function subscribed(topics: Array<{topic: string, channelType: ChannelType}>) {
  return {
    type: constants.SUBSCRIBED_TO_TOPICS,
    payload: topics as ActionSubscribePayload,
  };
}

export function unsubscribed(topics: Array<string>) {
  return {
    type: constants.UNSUBSCRIBED_TO_TOPICS,
    payload: topics as ActionUnsubscribePayload,
  };
}

export function setError(error: string) {
  return {
    type: constants.ERROR,
    payload: error as ActionErrorPayload,
  };
}
