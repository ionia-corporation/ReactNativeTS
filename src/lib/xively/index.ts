import IDM from './idm';
import Blueprint from './blueprint';
import TimeSeries from './timeseries';
import XivelyComm from './xively-comm';
import Logs from './logs';
import { XivelyConfig } from './models/index';

class Xively {
  comm: XivelyComm;
  config: XivelyConfig;

  blueprint: Blueprint;
  idm: IDM;
  logs: Logs;
  timeseries: TimeSeries;

  constructor(cfg: XivelyConfig) {
    this.comm = new XivelyComm(cfg);
    this.config = cfg;
    this.blueprint = new Blueprint(cfg, this.comm);
    this.idm = new IDM(cfg, this.comm);
    this.logs = new Logs(cfg, this.comm);
    this.timeseries = new TimeSeries(cfg, this.comm);
  }
}

export default Xively;
