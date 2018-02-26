import * as actions from './actions';
import { AppState } from '../../types';
import { User } from '../../lib/xively/models/user';
import { initialState } from '../blueprint/devices/actions';

export interface AuthorizationState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string;
}
type Reducer = (state: AuthorizationState, action) => AuthorizationState;
const InitialState = {
  isAuthenticated: false,
  loading: false,
  error: undefined,
}
export const reducer: Reducer = (state = InitialState , action) => {
  switch (action.type) {
    case actions.AUTH_LOGIN_REQUEST:
      return { ...state, loading: true, error: undefined }
    case actions.AUTH_LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true, loading: false };
    case actions.AUTH_LOGIN_FAILURE:
      return { ...state, error: action.payload }
    case actions.AUTH_LOGOUT_REQUEST:
      return { ...state, loading: true, error: undefined }
    case actions.AUTH_LOGOUT_SUCCESS:
      return { ...state, isAuthenticated: false, loading: false };
    case actions.AUTH_LOGOUT_FAILURE:
      return { ...state, error: action.payload }
    case actions.AUTH_JWT_RENEWAL_FAILURE:
      return { ...state, isAuthenticated: false, error: action.payload }
    default:
      return state;
  }
};
