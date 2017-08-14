import { cloneDeep } from 'lodash';
import { Action } from 'redux-actions';
import { parseTopic } from './utils';
import { Serdes, ChannelType } from './types';

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
  reconnecting: boolean;
  connected: boolean;
  error: string;
  data: {
    [topicName: string]: TopicData,
  };
}



export interface ActionMessagePayload {
  topic: string;
  channelType: ChannelType;
  stringPayload: any;
}

export type ActionSubscribe = Array<{topic: string, channelType: ChannelType}>;
export type ActionUnsubscribe = Array<string>;
export type ActionRestoreSubscriptionState = { [topicName: string]: TopicData };


const initialState: MqttState = {
  error: '',
  connecting: true,
  connected: false,
  reconnecting: false,
  data: {},
};

export const constants = {
  CONNECTED: 'mqtt/CONNECTED',
  NOT_CONNECTED: 'mqtt/NOT_CONNECTED',
  CONNECTING: 'mqtt/CONNECTING',
  RECONNECTING: 'mqtt/RECONNECTING',
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
//
// parser and stringifier and specified for each "channel" (do not confuse this with topic),
// see the type definition for Serde for more details.
export default function mqttReducerFactory(serdesParam: Serdes) {
  serdes = serdesParam;
  return function mqttReducer(state = initialState, action: Action<any>) {
    switch (action.type) {

      case constants.MESSAGE:
        return (() => {
          const { topic, channelType, stringPayload } = (action as Action<ActionMessagePayload>).payload;

          const data = cloneDeep(state.data);

          let channel;
          try {
            channel = parseTopic(topic).channel;
          } catch (err) {
            console.error(`MQTT Reducer: error while parsing a topic`, topic);
            return state;
          }

          let channelParser = serdes[channel] && serdes[channel].parse ? serdes[channel].parse : null;

          let parsedPayload = null;
          if (channelParser) {
            parsedPayload = channelParser(stringPayload);
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
          const payload = (action as Action<ActionSubscribe>).payload;
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
          const topicsToUnsubscribe = (action as Action<ActionUnsubscribe>).payload;
          const subscriptions = { ...state.data };
          topicsToUnsubscribe.forEach((topic) => {
            delete subscriptions[topic];
          });

          return { ...state, data: subscriptions };
        })();


      case constants.RESTORE_SUBSCRIPTION_STATE:
        return (() => {
          const subscriptions = (action as Action<ActionRestoreSubscriptionState>).payload;
          return { ...state, data: subscriptions };
        })();

      case constants.CONNECTING:
        return { ...state, connecting: true, connected: false };

      case constants.CONNECTED:
        return { ...state, connecting: false, reconnecting: false, connected: true };

      case constants.NOT_CONNECTED:
        return { ...state, connecting: false, reconnecting: false, connected: false };

      case constants.RECONNECTING:
        return { ...state, connecting: false, reconnecting: true, connected: false };

      case constants.ERROR:
        return (() => {
          const error = (action as Action<string>).payload;
          return { ...state, error: error };
        })();

      case constants.INITIAL_STATE:
        return initialState;

      default:
        return state;
    }
  };
}
