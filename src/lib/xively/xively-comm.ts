/* tslint:disable:no-extra-boolean-cast */
/* tslint:disable:object-literal-key-quotes */
import * as comm from '../comm';
import { Authorization, CommOptions, XivelyConfig } from './models/index';

// TODO: store this somewhere on the phone or at least abstract storage
export let JWT : string = '';
export let JWT_LAST_UPDATED: number = 0;

class XivelyComm {
  config: XivelyConfig;
  urlIDM: string;

  constructor(cfg: XivelyConfig) {
    this.config = cfg;
    this.urlIDM = 'https://id'
      + (this.config.environment.length ? '.' + this.config.environment : '')
      + '.xively.com/api/v1/';
  }

  getXivelyJson(options: CommOptions, requireJwt: boolean): any {
    if (requireJwt) {
      // make sure headers is there
      if (!options.headers) {
        options.headers = {};
      }
      options.headers['Content-Type'] = 'application/json';

      // check last JWT expiration
      return this.getCurrentJwt()
        .then((savedJwt) => {
          if (savedJwt) {
            options.headers['Authorization'] = 'Bearer ' + savedJwt;
            return comm.getJson(options)
              .then((res : any) => {
                return this.skimJwt(res);
              });
          } else {
            throw new Error('Must login first!');
          }
        });

    } else {
      // don't need auth, just call comm
      return comm.getJson(options)
        .then((res : any) => {
          return this.skimJwt(res);
        });
    }
  }

  clearJwt() {
    JWT = '';
  }

  checkJwt(): Promise<boolean> {
    return this.getCurrentJwt()
      .then((jwt) => true)
      .catch((e) => false);
  }

  checkJwtNoRenew(): boolean {
    const lastUpdatedInt = JWT_LAST_UPDATED;
    let lastUpdated = isNaN(lastUpdatedInt) ? null : new Date(lastUpdatedInt);
    let savedJwt = JWT;
    if (lastUpdated !== null && !!savedJwt) {
      // check if expired
      if (new Date().getTime() - lastUpdated.getTime() <= (this.config.jwtExpiration || 600000)) {
        return true;
      }
    }
  }

  // struggled with putting this here or in IDM...
  getCurrentJwt(): Promise<string> {
    const lastUpdatedInt = JWT_LAST_UPDATED;
    let lastUpdated = isNaN(lastUpdatedInt) ? null : new Date(lastUpdatedInt);
    let savedJwt = JWT;
    if (lastUpdated !== null && !!savedJwt) {
      // check if expired
      if (new Date().getTime() - lastUpdated.getTime() > (this.config.jwtExpiration || 600000)) {
        // try renewing JWT
        return this.renewJwt(savedJwt)
          .then((res) => {
            return res.jwt;
          });
      }
    }
    return new Promise<string>((resolve, reject) => {
      if (savedJwt) {
        resolve(savedJwt);
      } else {
        throw new Error('Not logged in');
      }
    });
  }

  renewJwt(jwtP?: string)
    : Promise<Authorization.LoginResponse> {
    const jwt = jwtP || JWT;
    let options = {
      url: this.urlIDM
      + 'sessions/renew-session',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwt,
      },
    };

    return comm.getJson(options)
      .then((res : any) => {
        return this.skimJwt(res);
      });
  }
  private skimJwt(jwtResponse: any): any {
    // TODO: when product allows CORS we should look at response headers
    //       for an updated JWT before returning, not just body
    if (typeof localStorage !== 'undefined') {
      if (jwtResponse && jwtResponse.jwt) {
        JWT = jwtResponse.jwt;
        JWT_LAST_UPDATED = new Date().getTime();
      }
    }

    return jwtResponse;
  }
}
export default XivelyComm;
