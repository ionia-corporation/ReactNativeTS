import { EndUser, constants } from './reducers';

export function upsert(users: Array<EndUser>) {
  return {
    type: constants.UPSERT,
    payload: users,
  };
}

export function remove(userId: string) {
  return {
    type: constants.REMOVE,
    payload: userId,
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
