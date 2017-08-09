import * as ReduxActions from 'redux-actions';
import { includes, keyBy, valuesIn } from 'lodash';

import { IdMap, AppState } from '../../../types';
import { Devices } from '../../../lib/xively/models';
import { getChildren, getOrganization, Organization } from '../organizations/reducers';
import { getEndUsers } from '../end-users/reducers';

export type Device = Devices.Device & { organization?: Organization};

export interface ExpandedDevice extends Devices.Device {
  userCount: number;
  organizationName?: string;
}

type Action = ReduxActions.Action<string> | ReduxActions.Action<Array<Device>>;
type Reducer = (state: DevicesState, action: Action) => DevicesState;

const initialState: DevicesState = {
  loading: false,
  loadedOnce: false,
  error: '',
  data: {},
};

export interface DevicesState {
  loading: boolean;
  loadedOnce: boolean;
  error: string;
  data: IdMap<Device>;
}

export const constants = {
  UPSERT: 'devices/UPSERT',
  REMOVE: 'devices/REMOVE',
  INITIAL_STATE: 'devices/INITIAL_STATE',
  LOADING_START: 'devices/LOADING_START',
  LOADING_END: 'devices/LOADING_END',
  ERROR: 'devices/ERROR',
};

const upsert: Reducer = (state, action) => {
  const newDevicesArray = action.payload as Array<Device>;
  const newDevices: IdMap<Device> = keyBy(newDevicesArray, 'id');
  const oldDevices = state.data;
  const devices = { ...oldDevices, ...newDevices };

  return { ...state, data: devices, loadedOnce: true };
};

const remove: Reducer = (state, action) => {
  const deviceId = action.payload as string;
  const devices = { ...state.data };
  delete devices[deviceId];
  return { ...state, data: devices };
};

const loadingStart: Reducer = (state, action) => {
  // Persists existing state, sets loading true, clears errors
  return { ...state, loading: true, error: '' };
};

const loadingEnd: Reducer = (state, action) => {
  return { ...state, loading: false };
};

const loadingError: Reducer = (state, action) => {
  const error = action.payload as string;
  return { ...state, error };
};

export const reducer: Reducer = (state = initialState, action) => {
  const actionMap = {
    [constants.UPSERT]: upsert,
    [constants.REMOVE]: remove,
    [constants.LOADING_START]: loadingStart,
    [constants.LOADING_END]: loadingEnd,
    [constants.ERROR]: loadingError,
    [constants.INITIAL_STATE]: () => initialState,
  };

  if (actionMap[action.type]) {
    return actionMap[action.type](state, action);
  }
  return state;
};

export function getDevice(state: AppState, deviceId): Device {
  const device: Device = state.blueprint.devices.data[deviceId];

  if (!device) {
    return null;
  }

  const organization: Organization = getOrganization(state, device.organizationId);

  if (!organization) {
    return device;
  }

  return { ...device, organization };
}

export function getDevices(state: AppState, orgId?: string, includeSubOrgs: boolean = true): Device[] {
  const devices = valuesIn(state.blueprint.devices.data);

  if (!orgId || !getOrganization(state, orgId)) {
    return devices;
  }

  const subOrgs = includeSubOrgs ? getChildren(state, orgId).map((org) => org.id) : [];
  const orgs = [orgId, ...subOrgs];

  return devices.filter((device) => includes(orgs, device.organizationId));
}

export function countDevices(state: AppState): number {
  return Object.keys(state.blueprint.devices.data).length;
}

export function getSortedDevices(state: AppState, columnProps) : Device[] {
  const devices = getDevices(state);

  return (devices.length && columnProps.direction !== 0)
    ? sort(
        columnProps.type,
        devices,
        columnProps.direction === 1 ? false : true,
        columnProps.prop)
    : devices;
}

export interface SortColumnProps {
  type: string;
  direction: number;
  prop: string;
}

export function getSortedExpandedDevices(state: AppState, columnProps: SortColumnProps, orgId: string) : ExpandedDevice[] {
  const devices = getDevices(state, orgId, orgId === undefined);
  const devicesExpanded = devices.map((device) => {
    const org = getOrganization(state, device.organizationId);
    const userCount = getEndUsers(state, device.organizationId).length;
    return {
      ...device,
      organizationName: org ? org.name : 'no group',
      userCount,
    };
  }) as ExpandedDevice[];

  return (devicesExpanded.length && columnProps.direction !== 0)
    ? sort(
        columnProps.type,
        devicesExpanded,
        columnProps.direction === 1 ? false : true,
        columnProps.prop)
    : devicesExpanded;
}

const sortObj = {
  // Contains the methods to perform the sorting.
  setReverse: (values: any[], reverse?: boolean) => {
    return !reverse ? values : values.reverse();
  },
  setProp: (value: any, prop?: string) => {
    return !prop ? value : value[prop];
  },
  setDate: (date) => {
    return date instanceof Date ? date : new Date(date);
  },
  common: (values: any[], reverse?: boolean) => {
    return !reverse ? values.sort() : values.sort().reverse();
  },
  string: (values: any[], reverse?: boolean, prop?: string) => {
    let sortedValues = values.sort((a, b) => {
      let valueA = sortObj.setProp(a, prop);
      let valueB = sortObj.setProp(b, prop);

      valueA = valueA ? valueA.toLowerCase() : '';
      valueB = valueB ? valueB.toLowerCase() : '';

      if (valueA < valueB) {
        return -1;
      }

      if (valueA > valueB) {
        return 1;
      }

      return 0;
    });

    return sortObj.setReverse(sortedValues, reverse);
  },
  date: (values: any[], reverse?: boolean, prop?: string) => {
    let sortedValues = values.sort((a, b) => {
      let dateA = +sortObj.setDate(sortObj.setProp(a, prop));
      let dateB = +sortObj.setDate(sortObj.setProp(b, prop));

      return dateA - dateB;
    });

    return sortObj.setReverse(sortedValues, reverse);
  },
  number: (values: any[], reverse?: boolean, prop?: string) => {
    let sortedValues = values.sort((a, b) => {
      return sortObj.setProp(a, prop) - sortObj.setProp(b, prop);
    });

    return sortObj.setReverse(sortedValues, reverse);
  },
};

function sort(type: string, values: any[], reverse?: boolean, prop?: string) {
  // Performs the sorting based on the given parameters.
  return sortObj[type](values, reverse, prop);
}
