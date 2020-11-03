const server = require('./index');

// Connection options
const hostname = '127.0.0.1';
const port = 3000;

// Start the server and list on specified host and port
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
