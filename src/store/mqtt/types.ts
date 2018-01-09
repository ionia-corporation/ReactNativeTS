import { AppState } from '../../types';
import { ParsedTopic } from './utils';

export { TopicData } from './reducers';

export type ChannelType = 'timeSeries' | 'simple';

export interface MqttMessage {
  toString: () => string;
}

export interface ChannelSerde<T = any> {
  // the parse function can do a variety of things with this signature:
  // - it can simple parse the string payload for every device
  // - it can conditionally parse the string payload on the device with parsedTopic.deviceId and state.blueprint.devices.data[deviceId]
  //    - in this way it can parse basing on different fields of the device
  // - it can also parse based on anything on the appstate
  parse?: (stringPayload: string, parsedTopic?: ParsedTopic, state?: AppState) => T;
  stringify: (structPayload: T) => string;
}

export interface Serdes {
  [channel: string]: ChannelSerde<any>;
}
