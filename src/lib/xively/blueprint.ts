/* tslint:disable:object-literal-key-quotes */
import { get } from 'lodash';
import XivelyComm from './xively-comm';
import {
  Devices as DevicesModel,
  Organizations as OrganizationsModel,
  User,
  Provision,
  XivelyConfig,
} from './models/index';

// TODO: remove this when a proper blueprint wrapper is writen
// Re export for better ergonomics
export { XivelyComm };

class Blueprint {
  config: any;
  devices: Devices;
  organizations: Organizations;
  endUsers: EndUsers;
  access: Access;
  batch: Batch;

  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.devices = new Devices(cfg, comm);
    this.organizations = new Organizations(cfg, comm);
    this.endUsers = new EndUsers(cfg, comm);
    this.access = new Access(cfg, comm);
    this.batch = new Batch(cfg, comm);
  }
}

// inner class is ghetto namespacing
class Access {
  config: XivelyConfig;
  comm: XivelyComm;
  urlBP: string;

  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.comm = comm;
    this.urlBP = 'https://blueprint'
      + (this.config.environment.length ? '.' + this.config.environment : '')
      + '.xively.com/api/v1/';
  }

  mqttCredentials(jwt: string, entityId: string, entityType: string): Promise<Provision.AccessMqttCredentialsResponse> {
    console.log('verbose', 'using logged in jwt to get mqtt creds');
    const options = {
      url: this.urlBP + 'access/mqtt-credentials',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + jwt,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: this.config.accountId,
        entityId,
        entityType,
      }),
    };

    return this.comm.getXivelyJson(options, false);
  }

}

class Batch {
  config: XivelyConfig;
  comm: XivelyComm;
  urlBP: string;

  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.comm = comm;
    this.urlBP = 'https://blueprint'
      + (this.config.environment.length ? '.' + this.config.environment : '')
      + '.xively.com/api/v1/';
  }

  // TODO verify it works with session jwt
  fetchAll(): Promise<[DevicesModel.DevicesListResponse, OrganizationsModel.OrganizationsListResponse, User.EndUsersResponse]> {
    const options = {
      url: this.urlBP + 'batch',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          method: 'GET',
          path: `/api/v1/devices?accountId=${this.config.accountId}&pageSize=1000&page=1`,
          payload: {},
        }, {
          method: 'GET',
          path: `/api/v1/organizations?accountId=${this.config.accountId}&pageSize=1000&page=1`,
          payload: {},
        }, {
          method: 'GET',
          path: `/api/v1/end-users?accountId=${this.config.accountId}&pageSize=1000&page=1`,
          payload: {},
        }],
      }),
    };

    return this.comm.getXivelyJson(options, true);
  }
}

class EndUsers {
  config: XivelyConfig;
  comm: XivelyComm;
  urlBP: string;

  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.comm = comm;
    this.urlBP = 'https://blueprint'
          + (this.config.environment.length ? '.' + this.config.environment : '')
          + '.xively.com/api/v1/';
  }

  createUser(request: User.CreateRequest): Promise<User.EndUserResponse> {
    const options = {
      url: this.urlBP
      + 'end-users?accountId=' + this.config.accountId,
      method: 'POST',
      body: JSON.stringify(request),
    };

    // TODO: any error message logic
    return this.comm.getXivelyJson(options, true);
  }

  getUserByUserId(userId: string): Promise<User.EndUsersResponse> {
    const options = {
      url: this.urlBP
      + 'end-users?accountId=' + this.config.accountId + '&userId=' + userId,
      method: 'GET',
    };

    // TODO: any error message logic
    return this.comm.getXivelyJson(options, true);
  }

  getUserById(id: string): Promise<User.EndUserResponse> {
    const options = {
      url: this.urlBP
      + 'end-users/' + id,
      method: 'GET',
    };

    // TODO: any error message logic
    return this.comm.getXivelyJson(options, true);
  }

  updateUser(etag: string, data: User.EndUser): Promise<User.EndUserResponse> {
    const options = {
      url: this.urlBP
      + 'end-users/'
      + data.id,
      method: 'PUT',
      headers: {
        'etag': etag,
      },
      body: JSON.stringify(data),
    };

    return this.comm.getXivelyJson(options, true)
      .catch((err: any) => {
        let error: string;
        const errorDetails: string = get(err, 'message.error.details[0].message', '');

        if (err.status === 401) {
          error = 'You are not authorized to take this action';
        } else if (errorDetails) {
          error = errorDetails;
        } else {
          error = 'An error has occurred';
        }

        throw (error);
      });
  }

  deleteUser(id: string, version: string): Promise<User.EndUserResponse> {
    const options = {
      url: this.urlBP
      + 'end-users/' + id,
      method: 'DELETE',
      headers: {
        'etag': version,
      },
    };
    return this.comm.getXivelyJson(options, true);
  }

  getUsersByOrg(orgId?: string, endUserTemplate?: string, page = 1, pageSize = 10): Promise<User.EndUsersResponse> {
    const options = {
      url: this.urlBP
      + 'end-users?'
      + 'accountId=' + this.config.accountId
      + (orgId ? '&organizationId=' + orgId : '')
      + (endUserTemplate ? '&endUserTemplateId=' + endUserTemplate : '')
      + '&pageSize=' + pageSize
      + '&page=' + page,
      method: 'GET',
    };

    return this.comm.getXivelyJson(options, true);
  }
}

class Devices {
  config: XivelyConfig;
  comm: XivelyComm;
  urlBP: string;
  private MAX_PAGE_SIZE = 1000;
  private MAX_ITERATIONS = 1000;

  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.comm = comm;
    this.urlBP = 'https://blueprint'
      + (this.config.environment.length ? '.' + this.config.environment : '')
      + '.xively.com/api/v1/';
  }

  getDevice(deviceId: string): Promise<DevicesModel.DeviceResponse> {
    const options = {
      url: this.urlBP + 'devices/' + deviceId,
      method: 'GET',
    };

    return this.comm.getXivelyJson(options, true);
  }

  async getDevices(pageSize = -1, pageNumber = -1): Promise<DevicesModel.DevicesListResponse> {
    // checking for correct params
    if (pageSize < 0 && pageNumber >= 0) {
      pageSize = 10;
    }
    if (pageSize >= 0 && pageNumber < 0) {
      pageNumber = 1;
    }
    pageSize = Math.min(pageSize, this.MAX_PAGE_SIZE);

    // default is to get all devices iterating through pages
    let getAll = pageSize < 0 && pageNumber < 0;
    if (getAll) {
      pageNumber = 1;
      pageSize = 1000;
    }

    const options = {
      url: this.urlBP
        + 'devices?accountId='
        + this.config.accountId
        + '&pageSize=' + pageSize
        + '&page=' + pageNumber,
      method: 'GET',
    };

    if (!getAll) {
      return this.comm.getXivelyJson(options, true);
    }

    let allDevices : DevicesModel.Device[];
    return this.comm.getXivelyJson(options, true)
      .then((devicesResponse: DevicesModel.DevicesListResponse) => {
        // got the first page, check if there are more
        allDevices = devicesResponse.devices.results;
        const devCount = devicesResponse.devices.meta.count;
        let resCount = devicesResponse.devices.results.length;

        let promises: Promise<DevicesModel.DevicesListResponse>[] = [];
        let page = 2;
        // get all pages
        // Recursive fetch of all devices in multiple pages
        while (resCount < devCount && page < this.MAX_ITERATIONS) {
          promises.push(this.getDevices(this.MAX_PAGE_SIZE, page));
          page++;
          resCount += pageSize;
        }

        return Promise.all(promises)
          .then((moreDevices: DevicesModel.DevicesListResponse[]) => {
            let meta = moreDevices.length ? moreDevices[0].devices.meta : null;
            moreDevices.forEach((devicePage) => {
              allDevices.push(...devicePage.devices.results);
            });
            return {
              devices: {
                meta,
                results: allDevices,
              },
            } as DevicesModel.DevicesListResponse;
          });
      });
    // TODO: any error message logic
  }

  createDevice(jwt: string, device: DevicesModel.Device): Promise<DevicesModel.DeviceResponse> {
    const options = {
      url: this.urlBP + 'devices',
      method: 'POST',
      json: true,
      headers: {
        'Authorization': 'Bearer ' + jwt,
      },
      body: device,
    };
    return this.comm.getXivelyJson(options, false);
  }

  updateDevice(device: DevicesModel.Device): Promise<DevicesModel.DeviceResponse> {
    const options = {
      url: this.urlBP
      + 'devices/' + device.id,
      method: 'PUT',
      body: device,
      headers: {
        'etag': device.version,
      },
    };

    return this.comm.getXivelyJson(options, true);
  }

  associate(req: DevicesModel.AssociationRequest): Promise<DevicesModel.AssociationResponse> {
    const options = {
      url: this.urlBP
      + 'association/start-association-with-code',
      method: 'POST',
      body: req,
    };

    return this.comm.getXivelyJson(options, true);
  }

  createAssociationCode(jwt: string, entityId: string): Promise<DevicesModel.CreateAssociationCodeResponse> {
    const options = {
      url: this.urlBP + 'association/create-association-code',
      method: 'POST',
      json: true,
      headers: {
        'Authorization': 'Bearer ' + jwt,
      },
      body: { deviceId : entityId },
    };

    return this.comm.getXivelyJson(options, false);
  }

}

// Temporary backport
class Organizations {
  config: XivelyConfig;
  comm: XivelyComm;
  urlBP: string;

  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.urlBP = 'https://blueprint'
      + (this.config.environment.length ? '.' + this.config.environment : '')
      + '.xively.com/api/v1/';
    this.comm = comm;
  }


  getOrganizations(organizationTemplateId?: string): Promise<OrganizationsModel.OrganizationsListResponse> {
    const options = {
      url: this.urlBP
      + 'organizations?accountId='
      + this.config.accountId
      + (organizationTemplateId ? '&organizationTemplateId='
        + organizationTemplateId : ''),
      method: 'GET',
    };

    return this.comm.getXivelyJson(options, true);
  }

  getOrganization(orgId: string, expandParent = false): Promise<OrganizationsModel.OrganizationsSingleResponse> {
    const options = {
      url: this.urlBP
      + 'organizations/' + orgId
      + '?'
      + (expandParent ? 'expand=parent' : ''),
      method: 'GET',
    };

    return this.comm.getXivelyJson(options, true);
  }

  createOrganization(org: OrganizationsModel.OrganizationCreateRequest): Promise<OrganizationsModel.OrganizationsSingleResponse> {
    org.accountId = org.accountId || this.config.accountId;
    const options = {
      url: this.urlBP
      + 'organizations',
      method: 'POST',
      body: org,
    };

    return this.comm.getXivelyJson(options, true);
  }


  // have to take in any because we don't know what custom fields are on the org
  saveOrganization(org: any): Promise<OrganizationsModel.OrganizationsSingleResponse> {
    const options = {
      url: this.urlBP
      + 'organizations/' + org.id,
      method: 'PUT',
      body: org,
      headers: {
        'etag': org.version,
      },
    };

    return this.comm.getXivelyJson(options, true);
  }

  // have to take in any because we don't know what custom fields are on the org
  updateOrganization(org: any): Promise<OrganizationsModel.OrganizationsSingleResponse> {
    const options = {
      url: this.urlBP
      + 'organizations/' + org.id,
      method: 'PUT',
      body: org,
      headers: {
        'etag': org.version,
      },
    };

    return this.comm.getXivelyJson(options, true)
      .catch((error: any) => {
        throw (error);
      });
  }

  deleteOrganization(id: string, version: string): Promise<OrganizationsModel.OrganizationsSingleResponse> {
    const options = {
      url: this.urlBP
      + 'organizations/' + id,
      method: 'DELETE',
      headers: {
        'etag': version,
      },
    };

    return this.comm.getXivelyJson(options, true);
  }
}

export default Blueprint;
