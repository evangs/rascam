var http = require('http');
var status = require('./status');
var camera = require('./camera');

function startServer(port, hostname){
  http.createServer(function (request, response) {
    // call function based on url requested
    if (request.url === '/ping'){
      status.ping(response);
    } else if (request.url === '/take-still'){
      camera.takeStill(response);
    } else if (request.url === '/static-img'){
      camera.staticImage(response);
    } else {
      status.notFound(response);
    }

  }).listen(port, hostname);
  console.log('Server running at http://' + hostname + ':' + port + '/');
};

module.exports.startServer = startServer;