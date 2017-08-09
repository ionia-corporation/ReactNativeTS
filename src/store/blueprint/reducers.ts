import { combineReducers } from 'redux';
import { reducer as devices, DevicesState } from './devices/reducers';
import { reducer as organizations, OrganizationsState } from './organizations/reducers';
import { reducer as endUsers, EndUsersState } from './end-users/reducers';

export type BlueprintState = {
  organizations: OrganizationsState,
  devices: DevicesState,
  endUsers: EndUsersState,
};

export const reducer = combineReducers({
  devices,
  organizations,
  endUsers,
});
