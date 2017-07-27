import * as qs from 'qs';

import XivelyComm from './xively-comm';
import { XivelyConfig, TimeSeries } from './models/index';

export default class TimeSeriesClient {
  private config: XivelyConfig;
  private comm: XivelyComm;

  // TODO: Move this value to XivelyConfig
  readonly baseUrl: string = 'https://timeseries.xively.com/api/v4/data';

  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.comm = comm;
  }

  private retrieveRequest(topic: string, params: any): Promise<TimeSeries.TimeSeriesResponse> {
    const queryParams = qs.stringify(params);

    const options = {
      method: 'GET',
      url: `${this.baseUrl}/${topic}${queryParams ? `?${queryParams}` : ''}`,
    };

    return this.comm.getXivelyJson(options, true);
  }

  /**
   * Retrieving timeseries data
   * https://developer.xively.com/v1.0/reference#retrieving-timeseries-data
   */
  getValues(params: TimeSeries.TimeSeriesRequest): Promise<TimeSeries.TimeSeriesResponse> {
    const { deviceId, channel, ...queryParams } = params;
    const topic = `xi/blue/v1/${this.config.accountId}/d/${deviceId}/${channel}`;

    return this.retrieveRequest(topic, queryParams);
  }

  /**
   * Retrieve the latest timeseries data
   * https://developer.xively.com/v1.0/reference#retrieve-the-latest-timeseries-data
   */
  getLatestValues(params: TimeSeries.TimeSeriesLatestRequest): Promise<TimeSeries.TimeSeriesResponse> {
    const { deviceId, channel, ...queryParams } = params;
    const topic = `xi/blue/v1/${this.config.accountId}/d/${deviceId}/${channel}/latest`;

    return this.retrieveRequest(topic, queryParams);
  }
}
