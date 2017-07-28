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
    let body: any;
    try {
      const url = options.url;
      delete options.url;
      res = await fetch(url, options);

      body = await res.json();
      // TODO: better error messaging here
      if (!res.ok) {
        reject(new Error(body && body.message ? body.message
          : 'Server sent error code ' + res.status + '\n\n' + JSON.stringify(body)));
      }
      if (body === null && res.status !== 204) {
        reject(new Error('Cannot get body object'));
      }

      if (body && body.success === false) {
        reject(new Error('Unsuccessful request\n' + JSON.stringify(res.body)));
      } else {
        resolve(body);
      }

    } catch (commError) {
      // TODO: better error messaging here
      if (res === undefined) {
        reject(new Error(!!res && !!body ? JSON.stringify(body) : 'No response or no response body'));
      } else if (commError) {
        logger.error('Error running HTTP request:\n' + JSON.stringify(commError)
          + '\n\nResponse:\n'
          + JSON.stringify(res));
        reject(commError);
      }
    }
  });
}
