import { Meta } from './index';

export module User {
  export interface CreateRequest {
    userId?: string;
    createIdmUser?: boolean;
    idmUserEmail?: string;
    idmUserPassword?: string;
    idmUserProfile?: {
      firstName?: string;
      lastName?: string;
      department?: string;
      phoneNumber?: string;
      company?: string;
    };
    accountId: string;
    endUserTemplateId?: string;
    organizationId: string;
    timezone?: string;
    emailAddress?: string;
    name?: string;
  }

  export interface GetUserIdRequest {
    emailAddress: string;
  }

  export interface GetUserIdResponse {
    userId: string;
    success: boolean;
  }

  export interface ResetPasswordRequest {
    userId: string;
  }

  export interface ResetPasswordResponse {
    resetToken: string;
    success: boolean;
    userId?: string;
  }

  export interface UpdateEmailResponse {
    userId: string;
  }

  export interface UpdatePasswordResponse {
    user: {
      userId: string;
    };
    success: boolean;
  }

  export interface ChangePasswordTokenRequest {
    userId: string;
    newPassword: string;
    passwordResetToken: string;
  }

  export interface ChangePasswordTokenResponse {
    success: boolean;
  }

  export interface UserProfileResponse {
    userId: string;
    emailAddress?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    department?: string;
    phoneNumber?: string;
    emailConfirmed?: boolean;
    address?: UserAddress;
  }

  export interface UserProfileUpdateResponse {
    success: boolean;
    user: {
      userId: string;
    };
  }

  export interface BatchUserRequest {
    userIds: string[];
  }

  export interface BatchUserResponse {
    success: boolean;
    users: UserProfile[];
  }

  export interface UserProfile {
    userId: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    department?: string;
    company?: string;
    phoneNumber?: string;
    address?: UserAddress;
    emailAddress?: string;
    emailConfirmed?: boolean;
  }

  export interface UserAddress {
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    countryCode?: string;
  }

  // *********** END USER ************ //
  export interface EndUserResponse {
    endUser?: EndUser;
    error?: any;
  }
  export interface EndUsersList {
    meta?: Meta;
    results?: Array<EndUser>;
  }
  export interface EndUsersResponse {
    endUsers?: EndUsersList;
    error?: any;
  }

  export interface EndUser {

    /**
     * account identifier
     */
    accountId?: string;

    /**
     * Creation date
     */
    created?: Date;

    /**
     * The user who created this item
     */
    createdById?: string;

    /**
     * endUserTemplate identifier
     */
    endUserTemplateId?: string;

    /**
     * Item unique identifier
     */
    id?: string;

    /**
     * Last modified date
     */
    lastModified?: Date;

    /**
     * The user who last modified this item
     */
    lastModifiedById?: string;

    /**
     * organization identifier
     */
    organizationId?: string;

    /**
     * Idm user identifier
     */
    userId?: string;

    /**
     * Optimistic concurrency version
     */
    version?: string;

    emailAddress?: string;
    name?: string;
  }

}
