export module Invitations {

  export enum InvitationStatus {
    CREATED = 0,
    ACCEPTED = 1,
  }

  /**
   * Invitation as stored in the DB.
   */
  export interface Invitation {
    id?: number;
    invitationToken: string;
    email: string;
    organizationId: string;
    invitationStatus: InvitationStatus;
  }

  /**
   * User information needed to be retrieved from the Identity API (and which
   * is not present in Blueprint) to detail a given group/organization.
   * NOTE: in Blueprint we have end-users, that lack their name; this is why
   * we reach the Identity API.
   */
  export interface UserProfile {
    /**
     * The end-user id (Blueprint).
     */
    userId: string;
    /**
     * The user name (IDM).
     */
    name: string;
    /**
     * The user email (IDM).
     */
    email: string;
  }

}