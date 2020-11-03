// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./lib/handlers');

// Instantiate a server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true); // Parse the request url
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, ''); // Get request url path and remove trailing slashes
  const method = req.method.toLowerCase(); // Get request the HTTP method
  const queryString = parsedUrl.query; // Get the request query string, if any
  const headers = req.headers; // Get request headers

  // Decode headers and specify character set to decode to
  const decoder = new StringDecoder('utf-8');
  let payloadData = ''; // This will be the payload data

  // Read the payload stream and concatenate it to payloadData
  req.on('data', (data) => {
    payloadData += decoder.write(data);
  });

  /**
   * [Listen to end event and send response]
   * This will be called always irrespective of method so send the reponse to user from here.
   */
  req.on('end', () => {
    payloadData += decoder.end(); // Final chunk of data

    // Identify the handler for request, return 404 not found for unmatched requests
    let reqHandler = null;

    // Select api handler for request path
    if (path && method && path === 'api/book' && method === 'post') {
      reqHandler = handlers.create;
    } else if (path && method && path === 'api/book' && queryString && queryString.isbn && method === 'get') {
      reqHandler = handlers.read;
    } else if (path && method && path === 'api/book' && method === 'get') {
      reqHandler = handlers.readAll;
    } else if (path && method && path === 'api/book' && method === 'put') {
      reqHandler = handlers.update;
    } else if (path && method && path === 'api/book' && method === 'delete') {
      reqHandler = handlers.delete;
    } else {
      reqHandler = handlers.notFound;
    }

    // Prepare data for handler
    const data = {
      path: path,
      method: method,
      queryString: queryString,
      headers: headers,
      payload: payloadData ? JSON.parse(payloadData) : ''
    };

    /**
     * [Call the handler for respective request]
     * @param {[object]}  data  [request data for handler]
     */
    reqHandler(data)
      .then(response => {
        res.statusCode = response.statusCode; // Attach statusCode returned from handler to response
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response.message));
      })
      .catch(error => {
        console.log('reqHandler error', error);
      });
  });
});

process.on('uncaughtException', function (err) {
  console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

module.exports = server;
