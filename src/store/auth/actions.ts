

export const AUTH_LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const AUTH_LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';

export const loginSuccess = () => ({
  type: AUTH_LOGIN_SUCCESS,
});

export const logoutSuccess = () => ({
  type: AUTH_LOGOUT_SUCCESS
});