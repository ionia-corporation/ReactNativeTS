export module Logs {

  export interface Log {
    '_index': string;
    '_type': string;
    '_id': string;
    '_score': number;
    '_source': LogSource;
  }

  export interface LogSource {
    'accountId': string;
    'sourceId': string;
    'sourceType': string;
    'message': string;
    'severity': string;
    'custom': {
      'connected': string,
    };
    'deviceTemplateId': string;
    'organizationId': string;
    'sourceTimestamp': number;
    'incidents': any[];
    'serviceTimestamp': number;
    'code': number;
    'details': string;
  }

  export interface LogsListBodyRequest {
    // Pagination: size of the page
    'size'?: number;
    // Pagination: given a paginated collection, get items from N (includes N)
    'from'?: number;
    // Elasticsearch query
    'query': any;
    // Elasticsearch sort
    'sort'?: LogsListSortCriteria[];
  }

  export interface LogsListResponse {
    'hits'?: LogsList;
  }

  export interface LogsList {
    'total': number;
    'max_score'?: number;
    'hits'?: Array<Log>;
  }

  export interface LogsListSortCriteria {
    [key: string]: { 
      order: string;
    };
  }

  export interface SearchDeviceOptions {
    deviceId: string;
    size: number;
    from: number;
    sortField: string;
    sortOrder: string;
  }

}
