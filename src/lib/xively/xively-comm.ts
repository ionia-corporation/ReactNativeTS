/* tslint:disable:no-extra-boolean-cast */
/* tslint:disable:object-literal-key-quotes */
import * as comm from '../comm';
import { Authorization, CommOptions, XivelyConfig } from './models/index';
import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

// TODO: store this somewhere on the phone or at least abstract storage
export let JWT : string = 'JWT';
export let JWT_LAST_UPDATED: string = 'JWT_LAST_UPDATED';

class XivelyComm {
  config: XivelyConfig;
  urlIDM: string;

  constructor(cfg: XivelyConfig, private jwtFailureCallback: Function) {
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

  async clearJwt() {
    try {
      await AsyncStorage.setItem(JWT, '');
      await AsyncStorage.setItem(JWT_LAST_UPDATED, '');
    } catch (err) {
      console.warn('ERROR clearing saved JWT: ' + JSON.stringify(err));
    }
  }

  checkJwt(): Promise<boolean> {
    return this.getCurrentJwt()
      .then((jwt) => true)
      .catch((e) => false);
  }

  async checkJwtNoRenew() {
    try {
      const lastUpdatedInt = parseInt(await AsyncStorage.getItem(JWT_LAST_UPDATED));
      let lastUpdated = isNaN(lastUpdatedInt) ? null : new Date(lastUpdatedInt);
      let savedJwt = await AsyncStorage.getItem(JWT);
      if (lastUpdated !== null && !!savedJwt) {
        // check if expired
        if (new Date().getTime() - lastUpdated.getTime() <= (this.config.jwtExpiration || 600000)) {
          return true;
        }
      }
    } catch (err) {
      console.warn('ERROR checking saved JWT: ' + JSON.stringify(err));
    }
  }

  // struggled with putting this here or in IDM...
  async getCurrentJwt() {
    try {
      const lastUpdatedInt = parseInt(await AsyncStorage.getItem(JWT_LAST_UPDATED));
      let lastUpdated = isNaN(lastUpdatedInt) ? null : new Date(lastUpdatedInt);
      let savedJwt = await AsyncStorage.getItem(JWT);
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
          // TODO, this is probably not a login, just a saved jwt
          resolve(savedJwt);
        } else {
          throw new Error('Not logged in');
        }
      });
    } catch (err) {
      if (err.message === 'Not logged in') {
        return;
      }
      console.warn('ERROR checking saved JWT: ' + err);
    }
  }

  async renewJwt(jwtP?: string)
    : Promise<Authorization.LoginResponse> {
    try{
      const jwt = jwtP || await AsyncStorage.getItem(JWT);
      let options = {
        url: this.urlIDM
        + 'sessions/renew-session',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt,
        },
      };

      return this.skimJwt(await comm.getJson(options));
    } catch (err) {
      console.warn('ERROR renewing saved JWT: ' + err);
      await this.jwtFailureCallback();
    }
  }
  private async skimJwt(jwtResponse: any) {
    // TODO: when product allows CORS we should look at response headers
    //       for an updated JWT before returning, not just body
    // TODO: figure out localStorage polyfill or similar
    // if (typeof localStorage !== 'undefined') {
      if (jwtResponse && jwtResponse.jwt) {
        try {
          await AsyncStorage.setItem(JWT, jwtResponse.jwt);
          await AsyncStorage.setItem(JWT_LAST_UPDATED, (new Date().getTime()) + '');
        } catch (err) {
          console.warn('ERROR saving JWT: ' + JSON.stringify(err));
        }
      }
    // }

    return jwtResponse;
  }
}
export default XivelyComm;
