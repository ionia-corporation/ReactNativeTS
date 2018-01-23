import * as request from 'superagent';
import * as Bluebird from 'bluebird';
import * as localAPI from './index';

const URL_BASE = '/api/user';
const URL_RESET_PASSWORD = URL_BASE + '/reset-password';
const URL_CHANGE_PASSWORD = URL_BASE + '/change-password';
const URL_REGISTRATION_SUCCESS = URL_BASE + '/registration-success';

export async function resetPassword(email: string): Promise<localAPI.ResetPasswordResponse> {
  const body = {
      emailAddress: email,
  } as localAPI.ResetPasswordRequestBody;



  // TODO: use native superagent promise support
  //
  // when the typings are updated with the latest version of the lib
  const req = new Bluebird((resolve, reject) => {
    request('POST', URL_RESET_PASSWORD)
      .send(body)
      .set('Content-Type', 'application/json')
      // in newer versions of super agent this returns a promise
      .end((err, res) => err ? reject(err) : resolve(res));
  });

  try {
    const res: any = await req;
    return res.body;

  } catch (errorData) {
    // TODO: Handle better
    throw new Error(errorData);
  }
}

export async function registrationSuccess(userId: string): Promise<localAPI.RegistrationSuccessResponseBody> {
  const body = {
      userId,
  } as localAPI.RegistrationSuccessRequestBody;


  // TODO: use native superagent promise support
  //
  // when the typings are updated with the latest version of the lib
  const req = new Bluebird((resolve, reject) => {
    request('POST', URL_REGISTRATION_SUCCESS)
      .send(body)
      .set('Content-Type', 'application/json')
      // in newer versions of super agent this returns a promise
      .end((err, res) => err ? reject(err) : resolve(res));
  });

  try {
    const res: any = await req;
    return res.body;

  } catch (errorData) {
    // TODO: Handle better
    throw new Error(errorData);
  }
}

export async function changePassword(
  newPassword: string, passwordResetToken: string, userId: string,
): Promise<localAPI.ChangePasswordResponse> {
  const body = {
    newPassword: newPassword,
    passwordResetToken: passwordResetToken,
    userId: userId,
  } as localAPI.ChangePasswordRequestBody;

  const req = new Bluebird((resolve, reject) => {
    request('POST', URL_CHANGE_PASSWORD)
      .send(body)
      .set('Content-Type', 'application/json')
      .end((err, res) => err ? reject(err) : resolve(res));
  });

  try {
    const res: any = await req;
    return res.body;

  } catch (errorData) {
    // TODO: Handle better
    throw new Error(errorData);
  }
}
