import { Organization, constants } from './reducers';

export function upsert(devices: Array<Organization>) {
  return {
    type: constants.UPSERT,
    payload: devices,
  };
}

export function remove(orgId: string) {
  return {
    type: constants.REMOVE,
    payload: orgId,
  };
}

export function initialState() {
  return {
    type: constants.INITIAL_STATE,
  };
}

export function loadingStart() {
  return {
    type: constants.LOADING_START,
  };
}

export function loadingEnd() {
  return {
    type: constants.LOADING_END,
  };
}

export function setError(message: string) {
  return {
    type: constants.ERROR,
    payload: message,
  };
}
