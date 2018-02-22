import { User } from '../lib/xively/models';
import { Invitations } from './models';
import { EndUser } from '../store/blueprint/end-users/reducers';

export interface RegistrationSuccessRequestBody {
 userId: string;
}

export interface RegistrationSuccessResponseBody {
 success: boolean;
}

export interface GetInvitationsByGroupResponseBody {
  invitations: Invitations.Invitation[];
}

export interface AcceptInvitationResponseBody extends User.EndUserResponse {
}

export interface InviteUserToGroupResponseBody extends Invitations.Invitation {
}

export type GetNamesOfUsersInGroupResponseBody = Invitations.UserProfile[];

export interface DeleteInvitationResponseBody {}

export interface DeleteEndUserFromGroupResponseBody {}

export interface UpdateEndUserFromGroupResponseBody {
  endUser?: EndUser;
}

// TODO: Everything below this line is legacy code. Update and refactor as needed
// ------------------------------------------------------------------------------

// TODO for all responses
// - Standarize the response formate with commond fields and create a type similar to the error responses
// - Change that in the users of those responses
//
// TODO: settle for a custom error format independent from Xively's api one
export type SignupResponse = any;

export interface ResetPasswordResponse {
  success: boolean;
}

// TODO: use a custom format
export interface ChangePasswordResponse extends User.ChangePasswordTokenResponse {}

export interface SignupRequestBody {
 name: string;
 password: string;
 emailAddress: string;
 timezone: string;
}

export interface ResetPasswordRequestBody {
  emailAddress: string;
}

export interface ChangePasswordRequestBody {
  userId: string;
  newPassword: string;
  passwordResetToken: string;
}
