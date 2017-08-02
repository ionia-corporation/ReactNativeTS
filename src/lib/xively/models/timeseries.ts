export module TimeSeries {
  enum GroupType {
    Ungrouped = 0,
    ByCategory = 1,
    ByTime = 2,
  }

  export interface TimeSeriesRequest {
    deviceId: string;
    channel: string;
    startDateTime: string;
    endDateTime: string;
    pageSize?: number;
    pagingToken?: number;
    omitNull?: boolean;
    category?: string;
    groupType?: GroupType;
  }

  export interface TimeSeriesLatestRequest {
    deviceId: string;
    channel: string;
    pageSize: number;
    omitNull?: boolean;
  }

  export interface TimeSeriesResponse {
    meta: {
      timeSpent: number;
      start: string;
      end: string;
      count: number;
      pagingToken?: string;
    };
    result: Array<DataPoint>;
  }

  export interface DataPoint {
    time: string;
    category: string;
    numericValue: number;
    stringValue?: string;
  }
}
