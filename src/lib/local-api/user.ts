import * as localAPI from './index';
import { config } from '../../config';

const apiUrl = config.xively.riotApiUrl;

const URL_BASE = apiUrl + '/api/user';
const URL_RESET_PASSWORD = URL_BASE + '/reset-password';
const URL_CHANGE_PASSWORD = URL_BASE + '/change-password';
const URL_REGISTRATION_SUCCESS = URL_BASE + '/registration-success';

export async function resetPassword(email: string): Promise<localAPI.ResetPasswordResponse> {
  const body = {
      emailAddress: email,
  } as localAPI.ResetPasswordRequestBody;

  try {
    const res: any = await fetch(URL_RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      }
    });

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

  try {
    const res: any = await fetch(URL_REGISTRATION_SUCCESS, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      }
    });

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

  try {
    const res: any = await fetch(URL_CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return res.body;
  } catch (errorData) {
    // TODO: Handle better
    throw new Error(errorData);
  }
}
