import { BatchRequest, constants } from './middleware';
import * as devices from './devices/actions';
import * as organizations from './organizations/actions';
import * as endUsers from './end-users/actions';

export { devices, endUsers, organizations };

// TODO: Add real params
export const batchRequest = (): BatchRequest => ({
  type: constants.BATCH,
  payload: {
    entities: [
      constants.ORGANIZATIONS,
      constants.DEVICES,
      constants.END_USERS,
    ],
  },
});
