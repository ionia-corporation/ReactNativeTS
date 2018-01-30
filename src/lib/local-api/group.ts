import * as localAPI from '../../types/local-api';
import { config } from '../../config';

const apiUrl = config.xively.riotApiUrl;

const URL_BASE = apiUrl + '/api/group';
const URL_INVITE_USER_SEGMENT = 'invite';

export function inviteUserToGroup(
  groupId: string,
  email: string,
  message: string,
  jwt: string,
): Promise<localAPI.InviteUserToGroupResponseBody> {
  const body = {
    email,
    message,
  };

  return fetch(`${URL_BASE}/${groupId}/${URL_INVITE_USER_SEGMENT}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    }
  }).then(res => res.body).catch(err => err);;
}

export function acceptInvitation(
  invitationToken: string,
  jwt: string,
): Promise<localAPI.AcceptInvitationResponseBody> {
  return fetch(`${URL_BASE}/${invitationToken}/acceptInvitation`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    }
  }).then(res => res.body).catch(err => err);;
}

export function getInvitationsByGroup(
  groupId: string,
  jwt: string,
): Promise<localAPI.GetInvitationsByGroupResponseBody> {
  return fetch(`${URL_BASE}/${groupId}/invitations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    }
  }).then(res => res.body).catch(err => err);;
}

export function getNamesOfUsersInGroup(
  groupId: string,
  jwt: string,
): Promise<localAPI.GetNamesOfUsersInGroupResponseBody> {
  return fetch(`${URL_BASE}/${groupId}/namesOfUsers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    }
  }).then(res => res.body).catch(err => err);;
}

export function deleteInvitation(
  groupId: string,
  email: string,
  jwt: string,
): Promise<localAPI.DeleteInvitationResponseBody> {
  return fetch(`${URL_BASE}/${groupId}/invitations/${email}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    }
  }).then(res => res.body).catch(err => err);
}

export function deleteUserFromGroup(
  groupId: string,
  endUserId: string,
  jwt: string,
): Promise<localAPI.DeleteEndUserFromGroupResponseBody> {
  return fetch(`${URL_BASE}/${groupId}/users/${endUserId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    }
  }).then(res => res.body).catch(err => err);
}

export function updateEndUser(
  groupId: string,
  endUserId: string,
  destGroupId: string,
  jwt: string,
): Promise<localAPI.UpdateEndUserFromGroupResponseBody> {
  const body = {
    destGroupId,
  };

  return fetch(`${URL_BASE}/${groupId}/users/${endUserId}/`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt,
    }
  }).then(res => res.body).catch(err => err);
}
