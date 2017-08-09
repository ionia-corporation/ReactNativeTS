import { Organizations, Devices, Logs } from '../lib/xively/models';

export { AppState } from '../store/reducers';

export enum RequestStatus {
  REQUEST_NOT_SENT,
  REQUEST_SENT,
  REQUEST_SUCCESS,
  REQUEST_ERROR,
}

export interface IdMap<T> {
  [entityId: string]: T;
}

export type Log = Logs.Log;
export type LogSource = Logs.LogSource;
export type LogsList = Logs.LogsList;

export interface Channel {
  // TOPIC
  channel: string;
  channelTemplateId: string;
  channelTemplateName: string;
  flags: {
    deviceUpdatable: boolean;
    timeSeries: boolean;
  };

  kinesisBridgeDelivery: number;
  persistenceType: 'timeSeries' | 'simple';
  serviceTopic: boolean;
}

export type Organization = Organizations.Organization;
// TODO: Monkey patch for missing attributes
export type Device = Devices.Device & {
  location?: any;
  channels?: Array<Channel>;
};
