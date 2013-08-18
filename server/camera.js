var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var util = require('util');
var status = require('./status');

function sendImage(response, filename){
  console.log(filename);
  fs.stat(filename, function(error, stat) {
    var rs;
    response.writeHead(200, {
      'Content-Type' : 'image/jpeg',
      'Content-Length' : stat.size
    });
    rs = fs.createReadStream(filename);
    console.log('about to pump file');
    util.pump(rs, response, function(err) {
      if(err) {
        throw err;
      }
    });
  });
};

function takeStill(response){
  // take a still photo and send it back in the response
  var date = new Date()
  var filename = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + '-' + date.getTime() + '.jpg';
  exec('raspistill -vf -t 0 -o ' + filename, function (error, stdout, stderr) {
    if (error === null) {
      path.exists(filename, function(exists){
        if (exists) {
          console.log('about to send image');
          sendImage(response, filename);
        } else {
          status.notFound(response);
        }
      });
    } else {
      status.serverError(response);
    }
  });
};

module.exports.takeStill = takeStill;
