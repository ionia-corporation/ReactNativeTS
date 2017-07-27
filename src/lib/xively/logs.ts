import XivelyComm from './xively-comm';
import { XivelyConfig } from './models/index';
import { Logs as LogsModel } from './models/index';

class Logs {
  private config: XivelyConfig;
  private comm: XivelyComm;

  // TODO: Move this value to XivelyConfig
  readonly baseUrl: string = 'https://logging.xively.com/api/v1/logs/search';

  constructor(cfg: XivelyConfig, comm: XivelyComm) {
    this.config = cfg;
    this.comm = comm;
  }

  async getForDevice(options: LogsModel.SearchDeviceOptions)
    : Promise<LogsModel.LogsListResponse> {
    const { deviceId, size, from, sortField, sortOrder } = options;
    const logsListSortCriteria = this.getLogsListSortCriteria(sortField, sortOrder);
    const deviceLogQuery: LogsModel.LogsListBodyRequest = {
      query: {
        bool: {
          must: [
            { term: { sourceId: deviceId } },
          ],
        },
      },
      size,
      from,
      sort: [logsListSortCriteria],
    };

    return this.comm.getXivelyJson(
      {
        url: this.baseUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceLogQuery),
      },
      true);
  }

  /**
   * Returns a sort criteria object accepted by elasticsearch.
   * https://www.elastic.co/guide/en/elasticsearch/reference/2.3/search-request-sort.html
   * @param field 
   * @param order 
   */
  private getLogsListSortCriteria(field: string, order: string)
    : LogsModel.LogsListSortCriteria {
    return { [field]: { order } };
  }

}

export default Logs;
