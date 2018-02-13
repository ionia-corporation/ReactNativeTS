import * as actions from './actions';
import { AppState } from '../../types';
import { User } from '../../lib/xively/models/user';

export interface AuthorizationState {
  isAuthenticated: boolean;
}
type Reducer = (state: AuthorizationState, action) => AuthorizationState;

export const reducer: Reducer = (state = { isAuthenticated: false } , action) => {
  switch (action.type) {
    case actions.AUTH_LOGIN_SUCCESS:
      console.log('HIT AUTH LOGIN REDUCER');
      return { ...state, isAuthenticated: true };

    case actions.AUTH_LOGOUT_SUCCESS:
      console.log('HIT AUTH ERR REDUCER');
      return { ...state, isAuthenticated: false };

    default:
      return state;
  }
};
