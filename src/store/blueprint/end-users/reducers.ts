import * as ReduxActions from 'redux-actions';
import { includes, keyBy, uniqBy, valuesIn } from 'lodash';

import { AppState, IdMap } from '../../../types';
import { User } from '../../../lib/xively/models';
import { getOrganization, getDescendants } from '../organizations/reducers';

export const constants = {
  UPSERT: 'end-users/UPSERT',
  REMOVE: 'end-users/REMOVE',
  INITIAL_STATE: 'end-users/INITIAL_STATE',
  LOADING_START: 'end-users/LOADING_START',
  LOADING_END: 'end-users/LOADING_END',
  ERROR: 'end-users/ERROR',
};

export type EndUser = User.EndUser;
type Action = ReduxActions.Action<string> | ReduxActions.Action<Array<EndUser>>;
type Reducer = (state: EndUsersState, action: Action) => EndUsersState;

const initialState: EndUsersState = {
  loading: false,
  error: '',
  data: {},
};

export interface EndUsersState {
  loading: boolean;
  error: string;
  data: IdMap<EndUser>;
}

const upsert: Reducer = (state, action) => {
  const newUsersArray = action.payload as Array<EndUser>;
  const newUsers: IdMap<EndUser> = keyBy(newUsersArray, 'id');
  const oldUsers = state.data;
  const users = { ...oldUsers, ...newUsers };
  return { ...state, data: users };
};

const remove: Reducer = (state, action) => {
  const userId = action.payload as string;
  const users = { ...state.data };
  delete users[userId];
  return { ...state, data: users };
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


//
// Selectors
//

export const getEndUser = (state: AppState, userId?: string): EndUser =>
  userId && state.blueprint.endUsers.data[userId] || null;

export const getEndUsers = (state: AppState, orgId?: string, includeFromSubOrgs: boolean = true): EndUser[] => {
  const endUsers = valuesIn(state.blueprint.endUsers.data);

  if (!orgId || !getOrganization(state, orgId)) {
    return endUsers;
  }

  const orgs = includeFromSubOrgs ?
    [].concat(orgId, ...getDescendants(state, orgId).map((org) => org.id)) :
    [orgId];

  return uniqBy(endUsers.filter((user) => includes(orgs, user.organizationId)), 'userId');
};
