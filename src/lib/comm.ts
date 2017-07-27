import { fetch } from 'react-native';

// cause we are in a browser
let logger = console;

interface CommOptions {
  url: string;
  method: string;
  headers?: any;
  body?: any;
}

export function getJson(options: CommOptions): Promise <any> {
  logger.log('info', 'Running HTTP request with opts:\n' +
    JSON.stringify(options));

  return new Promise(async (
    resolve: (user: any) => any,
    reject: (err: any) => any,
  ) => {
    let res: any;
    try {
      res = await fetch(options.url, options);

      if (res === undefined || !res.ok) {
        reject(new Error(!!res && !!res.body ? JSON.stringify(res.body) : 'No response or no response body'));
      } else if (res.body === null && res.status !== 204) {
        reject(new Error('Cannot get body object'));
      }
      const body = await res.json();

      if (body && body.success === false) {
        reject(new Error('Unsuccessful request\n' + JSON.stringify(res.body)));
      } else {
        resolve(body);
      }

    } catch (err) {
      if (err) {
        logger.error('Error running HTTP request:\n' + JSON.stringify(err)
          + '\n\nResponse:\n'
          + JSON.stringify(res));
        reject(err);
      }
    }
  });
}
