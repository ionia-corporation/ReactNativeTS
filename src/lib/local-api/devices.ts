import { Logs as LogsModel } from '../xively/models/logs';

const BASE_URL = '/api/devices';

// TODO: type the response
// TODO: do we need to make a promise and then await it here?
export async function deleteDevice(jwt: string, deviceId: string): Promise<any> {
  const url = `${BASE_URL}/${deviceId}`;

  try {
    const res: any = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt,
      }
    });

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
  const params = new URLSearchParams(searchOptions as any);
  const url = `${BASE_URL}/${deviceId}/logs/?${params}`;

  try {
    const res: any = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt,
      }
    });
    return res.body;
  } catch (errorData) {
    // TODO: This better
    throw new Error(errorData);
  }
}
