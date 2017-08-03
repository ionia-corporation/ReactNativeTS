import { UserProfile } from './reducers';
import xively from '../../lib/xively';

// Fetch
export const PROFILE_FETCH_REQUEST = 'profile/FETCH_REQUEST';
export const PROFILE_FETCH_SUCCESS = 'profile/FETCH_SUCCESS';
export const PROFILE_FETCH_FAILURE = 'profile/FETCH_FAILURE';

function fetchRequest() {
  return {
    type: PROFILE_FETCH_REQUEST,
  };
}

function fetchSuccess(profile: UserProfile) {
  return {
    type: PROFILE_FETCH_SUCCESS,
    payload: profile,
  };
}

function fetchFailure(error: any) {
  return {
    type: PROFILE_FETCH_FAILURE,
    payload: error,
  };
}

export function fetchProfile(userId?: string) {
  return async (dispatch) => {
    try {
      dispatch(fetchRequest());

      const profile = await xively.idm.user.getProfile(
        userId ? userId : await xively.idm.user.getCurrentUserId(),
      );

      dispatch(fetchSuccess(profile));
    } catch (ex) {
      dispatch(fetchFailure({}));
    }
  };
}

// Update
export const PROFILE_UPDATE = 'profile/UPDATE';

export function updateProfile(profile: UserProfile) {
  return {
    type: PROFILE_UPDATE,
    payload: profile,
  };
}
