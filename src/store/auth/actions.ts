import xively from '../../lib/xively';

export const AUTH_LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
export const AUTH_LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST';
export const AUTH_LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
export const AUTH_LOGOUT_FAILURE = 'auth/LOGOUT_FAILURE';

const loginRequest = () => ({
  type: AUTH_LOGIN_REQUEST,
})

const loginSuccess = () => ({
  type: AUTH_LOGIN_SUCCESS,
});

const loginFailure = (error) => ({
  type: AUTH_LOGIN_FAILURE,
  payload: error,
})

const logoutRequest = () => ({
  type: AUTH_LOGOUT_REQUEST,
})

const logoutSuccess = () => ({
  type: AUTH_LOGOUT_SUCCESS,
});

const logoutFailure = (error) => ({
  type: AUTH_LOGOUT_FAILURE,
  payload: error,
})


export const login = (userOptions) => {
  return async (dispatch) => {
    try {
      dispatch(loginRequest());
      const res = await xively.idm.authentication.login(userOptions);
      if (!res.jwt) {
        throw new Error('Not Authorized');
      }
      dispatch(loginSuccess());
    } catch(err) {
      dispatch(loginFailure(err))
    }
  }
}


export const logout = (userOptions) => {
  return async (dispatch) => {
    try {
      dispatch(logoutRequest());
      await xively.idm.authentication.logout();
      dispatch(logoutSuccess());
    } catch(err) {
      dispatch(logoutFailure(err))
    }
  }
}

