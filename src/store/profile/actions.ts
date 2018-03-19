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
export const PROFILE_UPDATE_REQUEST = 'profile/UPDATE_REQUEST';
export const PROFILE_UPDATE_SUCCESS = 'profile/UPDATE_SUCCESS';
export const PROFILE_UPDATE_FAILURE = 'profile/UPDATE_FAILURE';

function updateRequest() {
  return {
    type: PROFILE_UPDATE_REQUEST
  }
}

function updateSuccess(profile: UserProfile) {
  return {
    type: PROFILE_UPDATE_SUCCESS,
    payload: profile,
  };
}

export function updateFailure(error: string) {
  return {
    type: PROFILE_FETCH_FAILURE,
    payload: error
  }
}

export function updateProfile(
  profile: UserProfile,
  newEmail?: string,
  updatePass?: { oldPass: string; newPass: string }
) {
  return async (dispatch) => {
    const { userId } = profile;
    
    try {
      dispatch(updateRequest());

      // Update profile and email address
      await Promise.all([
        xively.idm.user.updateProfile(profile),
        newEmail && xively.idm.user.updateEmail(userId, newEmail),
        updatePass && xively.idm.user.updatePassword(userId, updatePass.oldPass, updatePass.newPass)
      ]);

      // Get new profile data
      const updatedProfile = await xively.idm.user.getProfile(userId);

      dispatch(updateSuccess(updatedProfile));
    } catch (err) {
      // const error = JSON.parse(err.text);
      const error = err.message || 'Error';

      dispatch(updateFailure(error))
    }
  } 
}
