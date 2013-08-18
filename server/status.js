// just sends back ping. essentially a way to check the server status
function ping(response){
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('ping', 'utf-8');
};

// simply returns a 404 not found response
function notFound(response){
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.end('not found', 'utf-8');
};

module.exports.ping = ping;
module.exports.notFound = notFound;