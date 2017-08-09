import { Organizations } from '../../../lib/xively/models';
import * as ReduxActions from 'redux-actions';
import { includes, isEmpty, keyBy, lowerCase, values, valuesIn } from 'lodash';
import { IdMap, AppState } from '../../../types';

export { AppState } from '../../../types';

export const constants = {
  UPSERT: 'organizations/UPSERT',
  REMOVE: 'organizations/REMOVE',
  INITIAL_STATE: 'organizations/INITIAL_STATE',
  LOADING_START: 'organizations/LOADING_START',
  LOADING_END: 'organizations/LOADING_END',
  ERROR: 'organizations/ERROR',
};

export type Organization = Organizations.Organization;
type Action = ReduxActions.Action<string> | ReduxActions.Action<Array<Organization>>;
type Reducer = (state: OrganizationsState, action: Action) => OrganizationsState;

export interface OrganizationsState {
  loading: boolean;
  error: string;
  data: IdMap<Organization>;
}

// NOTE: doesn't scale well, but we are assuming a small level of orgs in RIoT
export interface OrganizationHierarchy {
  organization: Organization;
  children: OrganizationHierarchy[];
}

const initialState: OrganizationsState = {
  loading: false,
  error: '',
  data: {},
};

const upsert: Reducer = (state, action) => {
  const newOrgsArray = action.payload as Array<Organization>;
  const newOrgs: IdMap<Organization> = keyBy(newOrgsArray, 'id');
  const oldOrgs = state.data;
  const orgs = { ...oldOrgs, ...newOrgs };

  return { ...state, data: orgs };
};

const remove: Reducer = (state, action) => {
  const deviceId = action.payload as string;
  const orgs = { ...state.data };
  delete orgs[deviceId];
  return { ...state, data: orgs };
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

export const getOrganization = (state: AppState, orgId?: string): Organization =>
  orgId && state.blueprint.organizations.data[orgId] || null;

export const countOrganizations = (state: AppState): number =>
  Object.keys(state.blueprint.organizations.data).length;

// Gets children organizations for the given organization
export const getChildren = (state: AppState, orgId?: string): Organization[] =>
  valuesIn(state.blueprint.organizations.data)
    .filter((org) => orgId ? org.parentId === orgId : !org.parentId);

// Gets ancestor organizations for the given organization
export const getAncestors = (state: AppState, orgId?: string): Organization[] => {
  const org = getOrganization(state, orgId);
  const parent = getOrganization(state, org && org.parentId);

  return parent && [parent, ...getAncestors(state, org.parentId)] || [];
};

// Gets descendant organizations for the given organization
export const getDescendants = (state: AppState, orgId?: string): Organization[] => {
  const children: Organization[] = getChildren(state, orgId);

  const descendants: Organization[] =
    children.reduce((all, org) => all.concat(...getDescendants(state, org.id)), []);

  return [].concat(...children, ...descendants);
};

// Gets top level organizations
export const getTopLevelOrganizations = (state: AppState): Organization[] =>
  getChildren(state, null);

// Gets deep hierarchy for the given organization
export const getHierarchy = (state: AppState, parentOrgId?: string): OrganizationHierarchy[] =>
  getChildren(state, parentOrgId)
    .map((child) => ({
        organization: child,
        children: getHierarchy(state, child.id),
      }),
    );

// Search organizations by name
export const searchByName = (state: AppState, search: string): Organization[] =>
  values(state.blueprint.organizations.data)
    .filter((org) => isEmpty(search)
      ? true
      : includes(lowerCase(org.name), lowerCase(search)));
