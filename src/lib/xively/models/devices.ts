import { Meta } from './index';

export module Devices {
  export interface DevicesList {
    'meta'?: Meta;
    'results'?: Array<Device>;
  }
  export interface Device {
    accountId?: string;
    name?: string;
    connected?: boolean;
    created?: Date;
    createdById?: string;
    deviceTemplateId?: string;
    externalIp?: string;
    firmwareVersion?: string;
    id?: string;
    lastConnected?: Date;
    lastModified?: Date;
    lastModifiedById?: string;
    latitude?: number;
    longitude?: number;
    organizationId?: string;
    provisioningState?: string;
    serialNumber?: string;
    version?: string;
    password?: string;
    associationCode?: string;
  }

  export interface DevicesListResponse {
    /**
     * devices list object
     */
    'devices'?: DevicesList;

    /**
     * Error response
     */
    'error'?: Error;
  }
  export interface DeviceResponse {

    /**
     * Single devices object
     */
    'device'?: Device;

    /**
     * Error response
     */
    'error'?: Error;
  }
  export interface AssociationRequest {
    associationCode: string;
    organizationId: string;
  }
  export interface AssociationResponse {
    deviceId: string;
  }
  export interface CreateAssociationCodeResponse {
    associationCode: string;
  }
}
