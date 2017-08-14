export { TopicData } from './reducers';

export type ChannelType = 'timeSeries' | 'simple';

export interface MqttMessage {
  payloadString: string;
  payloadBytes: any;
  destinationName: string;
  qos: number;
  retained: boolean;
  duplicate: boolean;
}

export interface ChannelSerde<T> {
  parse?: (stringPayload: string) => T;
  stringify: (structPayload: T) => string;
}

export interface Serdes {
  [channel: string]: ChannelSerde<any>;
}
