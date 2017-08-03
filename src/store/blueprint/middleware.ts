import * as Redux from 'redux';
import * as ReduxActions from 'redux-actions';

import xively from '../../lib/xively';
import * as devicesActions from './devices/actions';
import * as organizationsActions from './organizations/actions';
import * as endUserActions from './end-users/actions';


// This middleware currently only exists for batch
// It can do all orgs and/or all devices. That's it. for now.

export const constants = {
  BATCH: 'blueprint/BATCH',
  BATCH_START: 'blueprint/BATCH_START',
  BATCH_END: 'blueprint/BATCH_END',
  BATCH_ERROR: 'blueprint/BATCH_ERROR',

  ORGANIZATIONS: 'blueprint/ORGANIZATIONS',
  DEVICES: 'blueprint/DEVICES',
  END_USERS: 'blueprint/END_USERS',
};

type MiddlewareActionHandler = (store: Redux.Store<any>, action) => void;

// TODO: Make this actually dynamic. It's hardcoded to get all of both now
export type BatchRequest = ReduxActions.Action<{
  entities: string[];
}>;

// TODO: make this typing better
const batchRequest = async (store: any, action: BatchRequest) => {
  store.dispatch(devicesActions.loadingStart());
  store.dispatch(organizationsActions.loadingStart());
  store.dispatch(endUserActions.loadingStart());
  let devicesRes, orgsRes, endUsersRes;

  try {
    const responses = await xively.blueprint.batch.fetchAll();
    [devicesRes, orgsRes, endUsersRes] = responses;

    const { devices } = devicesRes;
    const { organizations } = orgsRes;
    const { endUsers } = endUsersRes;

    responses.forEach((res) => {
      if (res.error) {
        throw res;
      }
    });

    store.dispatch(devicesActions.upsert(devices.results));
    store.dispatch(organizationsActions.upsert(organizations.results));
    store.dispatch(endUserActions.upsert(endUsers.results));

    store.dispatch(organizationsActions.loadingEnd());
    store.dispatch(devicesActions.loadingEnd());
    store.dispatch(endUserActions.loadingEnd());
  } catch (error) {
    console.log(error);
    if (orgsRes.error) {
      store.dispatch(organizationsActions.setError(orgsRes.error.message));
    }
    store.dispatch(organizationsActions.loadingEnd());

    if (devicesRes.error) {
      store.dispatch(devicesActions.setError(devicesRes.error.message));
    }
    store.dispatch(devicesActions.loadingEnd());
  }
};

export default function createBlueprintMiddleware() {
  // TODO: Better typings
  const xivelyMiddleware: Redux.Middleware = (store) => (next) => (action) => {
    const actionMap = {
      [constants.BATCH]: batchRequest,
    };

    if (actionMap[action.type]) {
      actionMap[action.type](store, action);
    }

    return next(action);
  };

  return xivelyMiddleware;
}
