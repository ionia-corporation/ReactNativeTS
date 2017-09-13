import * as mqtt from 'mqtt';
import { Dispatch as reduxDispatch } from 'redux';
import { cloneDeep, values } from 'lodash';
import xively from '../../lib/xively';
import { Device, Channel, AppState } from '../../types';
import { constants, MqttState, serdes, ActionRestoreSubscriptionState } from './reducers';
import { parseTopic } from './utils';
import { ChannelType, MqttMessage, TopicData } from './types';

// TODO use a config param
const MQTT_HOST = 'wss://broker.xively.com:443/';

let client: mqtt.Client; // lsl

let handlers = {};

type GetState = () => AppState;
type Dispatch = reduxDispatch<AppState>;

export function connect() {
  return async function(dispatch: Dispatch, getState: GetState) {
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

    dispatch(connecting());

    handlers['connect'] = () => dispatch({ type: constants.CONNECTED });
    handlers['close'] = () => dispatch(notConnected());
    handlers['offline'] = () => dispatch(notConnected());
    handlers['error'] = (err: any) => dispatch(setError(`Something went wrong: ${err}`));
    handlers['message'] = (topic: string, message: MqttMessage) => dispatch(onMessage(topic, message));

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
    handlers['reconnect'] = async () => {
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

    Object.keys(handlers)
      .map((eventName) => [eventName, handlers[eventName]])
      .forEach(([eventName, handler]) => {
        client.on(eventName, handler);
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

    Object.keys(handlers)
      .map((eventName) => [eventName, handlers[eventName]])
      .forEach(([eventName, handler]) => {
        client.removeListener(eventName, handler);
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
    const notSubscribedTopics = (channel: Channel) => !(subscriptions as any).includes(channel.channel);

    const topicsToSubscribe = device.channels
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


export function unsubscribeAll() {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state: MqttState = getState().mqtt;
    const topics = Object.keys(state.data);
    client.unsubscribe(topics);
    dispatch(unsubscribed(topics));
  };
}


export function onMessage(topic: string, message: MqttMessage) {
  return async function(dispatch: Dispatch, getState: GetState) {
    const state: MqttState = getState().mqtt;
    const channelType = state.data[topic].channelType;
    const payload = {
      topic,
      channelType,
      stringPayload: message.toString(),
    };


    dispatch({
      type: constants.MESSAGE,
      payload,
    });
  };
}


export function send<T>(topic: string, payload: T, options: mqtt.IClientPublishOptions = {}) {
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
