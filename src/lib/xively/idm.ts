/* tslint:disable:object-literal-key-quotes */
import { Authorization, XivelyConfig, User } from './models/index';
import jwt from 'jwt-decode';

import XivelyComm from './xively-comm';

class IDM {
  config: XivelyConfig;
  authentication: Authentication;
  user: UserIDM;
  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.authentication = new Authentication(cfg, comm);
    this.user = new UserIDM(cfg, comm);
  }
}

// inner class is ghetto namespacing
class Authentication {
  config: XivelyConfig;
  comm: XivelyComm;
  urlIDM: string;

  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.urlIDM = 'https://id'
      + (this.config.environment.length ? '.' + this.config.environment : '')
      + '.xively.com/api/v1/';
    this.comm = comm;
  }

  login(opts: Authorization.LoginRequest)
    : Promise<Authorization.LoginResponse> {
    // TODO: do we want to validate opts here?
    const options = {
      url: this.urlIDM
      + 'auth/login-user?accountId='
      + this.config.accountId,
      method: 'POST',
      body: JSON.stringify({
        accountId: this.config.accountId,
        emailAddress: opts.emailAddress,
        password: opts.password,
        renewalType: opts.renewalType ? opts.renewalType : 'short',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.comm.getXivelyJson(options, false)
  }

  logout() {
    this.comm.clearJwt();
  }

  createUser(opts: Authorization.CreateUserRequest)
    : Promise<Authorization.CreateUserResponse> {

    if (!this.config.applicationToken) {
      throw new Error('Application token required to create a user!');
    }

    const options = {
      url: this.urlIDM + 'auth/create-user',
      method: 'POST',
      body: JSON.stringify({
        accountId: this.config.accountId,
        emailAddress: opts.emailAddress,
        password: opts.password,
        firstName: opts.firstName,
        lastName: opts.lastName,
        applicationId: opts.applicationId,
        phoneNumber: opts.phoneNumber,
      }),
      headers: {
        'Content-Type': 'application/json',
        'AccessToken': this.config.applicationToken,
      },
    };

    // TODO: any error message logic
    return this.comm.getXivelyJson(options, false);
  }
}


class UserIDM {
  config: XivelyConfig;
  comm: XivelyComm;
  urlIDM: string;

  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.urlIDM = 'https://id'
      + (this.config.environment.length ? '.' + this.config.environment : '')
      + '.xively.com/api/v1/';
    this.comm = comm;
  }

  changePasswordWithToken(opts: User.ChangePasswordTokenRequest)
    : Promise<User.ChangePasswordTokenResponse> {

    const options = {
      url: this.urlIDM
        + 'users/'
        + opts.userId
        + '/change-password-with-token',
      body: {
        newPassword: opts.newPassword,
        passwordResetToken: opts.passwordResetToken,
      },
      method: 'POST',
    };

    // TODO: any error message logic
    return this.comm.getXivelyJson(options, false);
  }

  getUserId(opts: User.GetUserIdRequest)
    : Promise<User.GetUserIdResponse> {

    if (!this.config.applicationToken) {
      throw new Error('Application token required to get the User Id!');
    }

    const options = {
      url: this.urlIDM
        + 'users/by-email/'
        + opts.emailAddress
        + '/user-id?accountId='
        + this.config.accountId,
      method: 'GET',
      headers: {
        'AccessToken': this.config.applicationToken,
      },
    };

    // TODO: any error message logic
    return this.comm.getXivelyJson(options, false);
  }

  resetPassword(opts: User.ResetPasswordRequest)
    : Promise<User.ResetPasswordResponse> {

    if (!this.config.applicationToken) {
      throw new Error('Application token required to reset a password!');
    }

    const options = {
      url: this.urlIDM
        + 'users/'
        + opts.userId
        + '/password-reset-token',
      method: 'GET',
      headers: {
        'AccessToken': this.config.applicationToken,
      },
    };

    // TODO: any error message logic
    return this.comm.getXivelyJson(options, false);
  }

  updateEmail(userId: string, newEmailAddress: string):
    Promise<User.UpdateEmailResponse> {

    const options = {
      url: this.urlIDM
        + 'profile/update-email-address',
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        newEmailAddress: newEmailAddress,
      }),
    };

    // TODO: any error message logic
    return this.comm.getXivelyJson(options, true);
  }

  updatePassword(userId: string, oldPassword: string, newPassword: string)
    : Promise<User.UpdatePasswordResponse> {

    const options = {
      url: this.urlIDM
        + 'profile/change-password',
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    };

    return this.comm.getXivelyJson(options, true)
      .catch((err: any) => {
        let error: any = null;
        if (err.status === 401) {
          error = { message: 'Wrong current password' };
        }
        if (err.message && err.message.error && err.message.error.details && err.message.error.details.length) {
          error = err.message.error.details[0].message;
        }
        throw (error || err);
      });
  }

  async getCurrentUserId() {
    const token = await this.comm.getCurrentJwt();
    const { userId } = jwt <{ userId: string }>(token);
    return userId;
  }

  getProfile(userId: string): Promise<User.UserProfileResponse> {
    const options = {
      url: this.urlIDM + `profile/${userId}`,
      method: 'GET',
    };

    // TODO: any error message logic
    return this.comm.getXivelyJson(options, true);
  }

  getUserBatch(users: User.BatchUserRequest)
    : Promise<User.BatchUserResponse> {
    const options = {
      url: this.urlIDM
        + 'users/batch/',
      body: users,
      method: 'POST',
    };

    // TODO: any error message logic
    return this.comm.getXivelyJson(options, true);
  }

  updateProfile(opts: User.UserProfile)
    : Promise<User.UserProfileUpdateResponse> {
    const options = {
      url: this.urlIDM
        + 'profile/update',
      method: 'POST',
      body: opts,
    };

    return this.comm.getXivelyJson(options, true)
      .catch((err: any) => {
        let error: any = null;
        if (err.status === 401) {
          error = { message: 'You are not authorized to take this action' };
        }
        if (err.message && err.message.error && err.message.error.details && err.message.error.details.length) {
          error = err.message.error.details[0].message;
        }
        throw (error || err);
      });
  }
}

export default IDM;
