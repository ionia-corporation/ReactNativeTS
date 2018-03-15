import * as actions from './actions';
import { AppState } from '../../types';
import { User } from '../../lib/xively/models/user';

export type UserProfile = User.UserProfile;
type Reducer = (state: ProfileState, action) => ProfileState;

export interface ProfileState {
  loading: boolean;
  error?: any;
  data?: UserProfile;
}

const initialState: ProfileState = {
  loading: false,
};

export const reducer: Reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.PROFILE_FETCH_REQUEST:
      return { ...state, loading: true, error: undefined };

    case actions.PROFILE_FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: undefined };

    case actions.PROFILE_FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case actions.PROFILE_UPDATE_REQUEST:
      return { ...state, error: undefined };

    case actions.PROFILE_UPDATE_SUCCESS:
      return { ...state, data: action.payload };

    case actions.PROFILE_UPDATE_FAILURE:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export function getProfile(state: AppState) {
  return state.profile.data;
}
