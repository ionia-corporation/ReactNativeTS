import xively from '../../lib/xively';
import * as localAPI from '../../lib/local-api/index';
import { config } from '../../config';

export const AUTH_LOGIN_REQUEST = 'auth/LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
export const AUTH_LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST';
export const AUTH_LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
export const AUTH_LOGOUT_FAILURE = 'auth/LOGOUT_FAILURE';
export const AUTH_JWT_RENEWAL_FAILURE = 'auth/JWT_RENEWAL_FAILURE';
export const AUTH_SIGNUP_REQUEST = 'auth/SIGNUP_REQUEST';
export const AUTH_SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS';
export const AUTH_SIGNUP_FAILURE = 'auth/SIGNUP_FAILURE';
export const AUTH_SIGNUP_ACCESS = 'auth/AUTH_SIGNUP_ACCESS';

// Login actions
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

// logout actions
const logoutRequest = () => ({
  type: AUTH_LOGOUT_REQUEST,
})

const logoutSuccess = () => ({
  type: AUTH_LOGOUT_SUCCESS,
});

const logoutFailure = (error) => ({
  type: AUTH_LOGOUT_FAILURE,
  payload: error,
});

// Signup actions
const signupRequest = () => ({
  type: AUTH_SIGNUP_REQUEST,
});

const signupSuccess = () => ({
  type: AUTH_SIGNUP_SUCCESS,
});

export const signupFailure = (error) => ({
  type: AUTH_SIGNUP_FAILURE,
  payload: error,
});

export const signupAccess = () => ({
  type: AUTH_SIGNUP_ACCESS,
});

// Exported async action creators
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
      let message = err.message;
      if (message === 'Unauthorized') {
        message = 'The credentials you provided don\'t match anything in our system. Forgot password?';
      }
      dispatch(loginFailure(message))
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
      dispatch(logoutFailure(err.message))
    }
  }
}

export const jwtRenewalFailure = (error) => {
  return async (dispatch) => {
    await xively.idm.authentication.comm.clearJwt();
    dispatch({
      type: AUTH_JWT_RENEWAL_FAILURE,
      payload: error
    })
  }
}

export const checkAuthentication = () => {
  return async (dispatch) => {
    try {
      await xively.idm.authentication.comm.getCurrentJwt();
      dispatch(loginSuccess())
    } catch(err) {
    }
  }
}

export const signup = (userOptions) => {
  return async (dispatch) => {
    try {
      dispatch(signupRequest());

      const resSignup = await xively.idm.authentication.createUser(userOptions);

      if (!resSignup.userId) {
        // TODO: Throw something better
        throw new Error('No user ID passed in');
      }

      // Login user to obtain JWT
      const resLogin = await xively.idm.authentication.login({
        emailAddress : userOptions.emailAddress,
        password : userOptions.password,
        renewalType: 'extended',
      });

      const accountId = config.xively.accountId;
      const endUserTemplateId = config.xively.endUserTemplate;
      const orgTemplateId = config.xively.baseOrgTemplate;

      // Create new org and end user in that org
      const orgRes = await xively.blueprint.organizations.createOrganization({
        accountId: accountId,
        name: `Organization for ${userOptions.emailAddress}`,
        organizationTemplateId: orgTemplateId,
        endUserTemplateId: endUserTemplateId,
      });

      if (!orgRes || !orgRes.organization.id || !orgRes.organization.defaultEndUser) {
        // TODO: Is this block needed?
        // TODO: Throw something better
        throw new Error('Org was not created right');
      }

      await localAPI.user.registrationSuccess(resSignup.userId);

      dispatch(signupSuccess());
    } catch (err) {
      let errorMsg = err.message || 'An error has occurred. Please try it again.';

      if (errorMsg === 'The user already exists.') {
        // TODO: Link to login screen?
        errorMsg = 'This email is already registered, did you mean to login?';
      } else if (errorMsg === 'emailAddress is required; password is required') {
        errorMsg = 'Email Address is required\nPassword is required';
      } else if (errorMsg === 'The password is not valid.') {
        errorMsg = 'Invalid password.\nYour password must be between 8 and 128 characters in length. It must not repeat 3 characters in a row. It must not contain any of the top 20 passwords. It must not contain your email username.';
      }

      dispatch(signupFailure(errorMsg));
    }
  }
}
