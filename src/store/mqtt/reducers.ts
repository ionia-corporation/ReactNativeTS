import { cloneDeep } from 'lodash';
import { Action } from 'redux-actions';
import { parseTopic } from './utils';
import { Serdes, ChannelType } from './types';
import { AppState } from '../../types';

export interface Message {
  stringPayload: string;
  parsedPayload: any;
  time: number;
}

export interface TopicData {
  channelType: ChannelType;
  message?: Message;
  messages?: Array<Message>;
}

export interface MqttState {
  connecting: boolean;
  disconnecting: boolean;
  reconnecting: boolean;
  reconnectCount: number;
  connected: boolean;
  error: string;
  data: {
    [topicName: string]: TopicData,
  };
}

const initialState: MqttState = {
  error: '',
  connecting: false,
  disconnecting: false,
  connected: false,
  reconnecting: false,
  reconnectCount: 0,
  data: {},
};

export interface ActionMessagePayload {
  appState: AppState;
  topic: string;
  channelType: ChannelType;
  stringPayload: any;
}

export type ActionSubscribePayload = Array<{ topic: string, channelType: ChannelType }>;
export type ActionUnsubscribePayload = Array<string>;
export type ActionRestoreSubscriptionStatePayload = { [topicName: string]: TopicData };
export type ActionErrorPayload = string;

export const constants = {
  CLOSE: 'mqtt/CLOSE',
  OFFLINE: 'mqtt/OFFLINE',
  CONNECTED: 'mqtt/CONNECTED',
  NOT_CONNECTED: 'mqtt/NOT_CONNECTED',
  CONNECT_START: 'mqtt/CONNECT_START',
  CONNECT_END: 'mqtt/CONNECT_END',
  RECONNECT_START: 'mqtt/RECONNECT_START',
  RECONNECT_END: 'mqtt/RECONNECT_END',
  DISCONNECT_START: 'mqtt/DISCONNECT_START',
  DISCONNECT_END: 'mqtt/DISCONNECT_END',
  SUBSCRIBED_TO_TOPICS: 'mqtt/SUBSCRIBED_TO_TOPIC',
  UNSUBSCRIBED_TO_TOPICS: 'mqtt/UNSUBSCRIBED_TO_TOPIC',
  RESTORE_SUBSCRIPTION_STATE: 'mqtt/RESTORE_SUBSCRIPTION_STATE',
  MESSAGE: 'mqtt/MESSAGE',
  ERROR: 'mqtt/ERROR',
  INITIAL_STATE: 'mqtt/INITIAL_STATE',
};

// Export a null reference to the serdes object,
// by the time you use it, it will be filled with the serdesParams
export let serdes: Serdes | null = null;

// serdes stands for Serialiser Deserialiser
// serdesParams is a simple way of parameterising parsers and stringifiers for each channel.
// - parsers are used for the incoming messages
// - stringifiers are used for the outgoing messages
export default function mqttReducerFactory(serdesParam: Serdes) {
  serdes = serdesParam;
  return function mqttReducer(state = initialState, action: Action<any>) {
    switch (action.type) {

      case constants.MESSAGE:
        return (() => {
          const { topic, channelType, stringPayload, appState } = (action as Action<ActionMessagePayload>).payload;

          const data = cloneDeep(state.data);

          let parsedTopic;
          try {
            parsedTopic = parseTopic(topic);
          } catch (err) {
            console.error(`MQTT Reducer: error while parsing a topic`, topic);
            return state;
          }

          const { channel } = parsedTopic;

          let channelParser;
          try {
            channelParser = serdes[channel].parse;
          } catch (err) {
            /* this is not the empty block you are looking for eslint */
          }

          let parsedPayload = null;
          if (channelParser) {
            // Important to pass all this data to the parsers because they might want
            // to conditionally parse based on the topic, or something in the app state such as
            // the device
            parsedPayload = channelParser(stringPayload, parsedTopic, appState);
          } else {
            console.log(`MQTT: parser not found for topic ${topic}, not parsing payload`);
          }

          const message: Message = {
            stringPayload,
            parsedPayload: parsedPayload,
            time: new Date().getTime(),
          };

          if (channelType === 'simple') {
            data[topic].message = message;

          } else if (channelType === 'timeSeries') {
            data[topic].messages = [].concat(data[topic].messages, [message]);
          }

          return { ...state, data };
        })();

      case constants.SUBSCRIBED_TO_TOPICS:
        return (() => {
          const payload = (action as Action<ActionSubscribePayload>).payload;
          const newSubscriptions = {};
          payload.forEach((sub) => {
            newSubscriptions[sub.topic] = {
              channelType: sub.channelType,
              messages: sub.channelType === 'timeSeries' ? [] : null,
            };
          });

          const oldSubscriptions = state.data;
          const subscriptions = { ...oldSubscriptions, ...newSubscriptions };

          return { ...state, data: subscriptions };
        })();

      case constants.UNSUBSCRIBED_TO_TOPICS:
        return (() => {
          const topicsToUnsubscribe = (action as Action<ActionUnsubscribePayload>).payload;
          const subscriptions = { ...state.data };
          topicsToUnsubscribe.forEach((topic) => {
            delete subscriptions[topic];
          });

          return { ...state, data: subscriptions };
        })();


      case constants.RESTORE_SUBSCRIPTION_STATE:
        return (() => {
          const subscriptions = (action as Action<ActionRestoreSubscriptionStatePayload>).payload;
          return { ...state, data: subscriptions };
        })();

      case constants.DISCONNECT_START:
        return { ...state, disconnecting: true };

      case constants.DISCONNECT_END:
        return { ...state, disconnecting: false };

      case constants.CONNECT_START:
        return { ...state, connecting: true, connected: false };

      case constants.CONNECTED:
        return { ...state, connecting: false, reconnecting: false, connected: true, reconnectCount: 0 };

      case constants.NOT_CONNECTED:
        return { ...state, connecting: false, reconnecting: false, connected: false };

      case constants.RECONNECT_START:
        return { ...state, connecting: false, reconnecting: true, connected: false, reconnectCount: state.reconnectCount + 1 };

      case constants.ERROR:
        return (() => {
          const error = (action as Action<ActionErrorPayload>).payload;
          return { ...state, error: error };
        })();

      case constants.INITIAL_STATE:
        return initialState;

      default:
        return state;
    }
  };
}
