export module Authorization {
  // TODO: move renewalType to string enum when we upgrade TS
  export interface LoginRequest {
    emailAddress: string;
    password: string;
    renewalType?: string;
  }
  export interface LoginResponse {
    jwt: string;
    csrfToken: string;
  }
  export interface CreateUserRequest {
    emailAddress: string;
    password: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    applicationId?: string;
    phoneNumber?: string;
  }
  export interface CreateUserResponse {
    userId: string;
    emailAddress: string;
    accountId: string;
    createdAt: string;
  }
}
