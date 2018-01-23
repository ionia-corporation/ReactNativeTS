import * as request from 'superagent';

import * as localAPI from '../../../common/types/local-api';

const URL_BASE = '/api/group';
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

  const reqPromise: Promise<localAPI.InviteUserToGroupResponseBody> =
    new Promise((resolve, reject) => {
      request('POST', `${URL_BASE}/${groupId}/${URL_INVITE_USER_SEGMENT}`)
        .send(body)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        // in newer versions of super agent this returns a promise
        .end((err, res) => (err ? reject(err) : resolve(res.body)));
    });
  return reqPromise;
}

export function acceptInvitation(
  invitationToken: string,
  jwt: string,
): Promise<localAPI.AcceptInvitationResponseBody> {
  const reqPromise: Promise<localAPI.AcceptInvitationResponseBody> =
    new Promise((resolve, reject) => {
      request('GET', `${URL_BASE}/${invitationToken}/acceptInvitation`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        // in newer versions of super agent this returns a promise
        .end((err, res) => (err ? reject(err) : resolve(res.body)));
    });
  return reqPromise;
}

export function getInvitationsByGroup(
  groupId: string,
  jwt: string,
): Promise<localAPI.GetInvitationsByGroupResponseBody> {
  const reqPromise: Promise<localAPI.GetInvitationsByGroupResponseBody> =
    new Promise((resolve, reject) => {
      request('GET', `${URL_BASE}/${groupId}/invitations`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        // in newer versions of super agent this returns a promise
        .end((err, res) => (err ? reject(err) : resolve(res.body)));
    });
  return reqPromise;
}

export function getNamesOfUsersInGroup(
  groupId: string,
  jwt: string,
): Promise<localAPI.GetNamesOfUsersInGroupResponseBody> {
  const reqPromise: Promise<localAPI.GetNamesOfUsersInGroupResponseBody> =
    new Promise((resolve, reject) => {
      request('GET', `${URL_BASE}/${groupId}/namesOfUsers`)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + jwt)
        // in newer versions of super agent this returns a promise
        .end((err, res) => (err ? reject(err) : resolve(res.body)));
    });
  return reqPromise;
}

export function deleteInvitation(
  groupId: string,
  email: string,
  jwt: string,
): Promise<localAPI.DeleteInvitationResponseBody> {
  return new Promise((resolve, reject) => {
    request('DELETE', `${URL_BASE}/${groupId}/invitations/${email}/`)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      // in newer versions of super agent this returns a promise
      .end((err, res) => (err ? reject(err) : resolve(res.body)));
  });
}

export function deleteUserFromGroup(
  groupId: string,
  endUserId: string,
  jwt: string,
): Promise<localAPI.DeleteEndUserFromGroupResponseBody> {
  return new Promise((resolve, reject) => {
    request('DELETE', `${URL_BASE}/${groupId}/users/${endUserId}/`)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      // in newer versions of super agent this returns a promise
      .end((err, res) => (err ? reject(err) : resolve(res.body)));
  });
}

export function updateEndUser(
  groupId: string,
  endUserId: string,
  destGroupId: string,
  jwt: string,
): Promise<localAPI.UpdateEndUserFromGroupResponseBody> {
  return new Promise((resolve, reject) => {
    const body = {
      destGroupId,
    };
    request('PUT', `${URL_BASE}/${groupId}/users/${endUserId}/`)
      .send(body)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      // in newer versions of super agent this returns a promise
      .end((err, res) => (err ? reject(err) : resolve(res.body)));
  });
}
