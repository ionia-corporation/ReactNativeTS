import * as request from 'superagent';
import * as Bluebird from 'bluebird';
import { Logs as LogsModel } from '../../../common/services/xively/models/logs';

const BASE_URL = '/api/devices';

// TODO: type the response
// TODO: do we need to make a promise and then await it here?
export async function deleteDevice(jwt: string, deviceId: string): Promise<any> {

  const url = BASE_URL + '/' + deviceId;

  const req = new Bluebird((resolve, reject) => {
    request('DELETE', url)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      // in newer versions of super agent this returns a promise
      .end((err, res) => err ? reject(err) : resolve(res));
  });

  try {
    const res: any = await req;
    return res.body;

  } catch (errorData) {
    // TODO: This better
    throw new Error(errorData);
  }
}

// TODO: do we need to make a promise and then await it here?
export async function searchLogs(
  jwt: string,
  deviceId: string,
  searchOptions: LogsModel.SearchDeviceOptions)
  : Promise<LogsModel.LogsListResponse> {

  const url = BASE_URL + '/' + deviceId + '/logs';

  const req = new Bluebird((resolve, reject) => {
    request('GET', url)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + jwt)
      .query(searchOptions)
      // in newer versions of super agent this returns a promise
      .end((err, res) => err ? reject(err) : resolve(res));
  });

  try {
    const res: any = await req;
    return res.body;
  } catch (errorData) {
    // TODO: This better
    throw new Error(errorData);
  }
}
