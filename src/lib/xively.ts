import Xively from './xively/index';
import { config } from '../config';

export const xively = new Xively(config.xively);

// auth renew
// NOTE: interval is based on hard-coded interval in xively client minus 10 seconds
setInterval(
  () => {
    // get new jwt
    xively.comm.renewJwt()
      .then((jwt) => {
        // do nothing
      })
      .catch((e) => {
        // TODO: do we redirect to login here?
        // TODO: do we just replace this whole thing with a re-run of the logic
        //       from inside of `authenticated.tsx`?
      });
  },
  Math.max(config.xively.jwtExpiration-1000, 5000));

export default xively;
