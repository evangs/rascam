var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var status = require('./status');

function fiveHundred(response){
  response.writeHead(500, { 'Content-Type': 'text/plain' });
  response.end('error taking still', 'utf-8');
};

function sendImage(response, img){
  response.writeHead(200, { 'Content-Type': 'image/jpg' });
  response.end(img, 'binary');
};

function takeStill(response){
  // take a still photo and send it back in the response
  var date = new Date()
  var filename = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + '-' + date.getTime() + '.jpg';
  exec('raspistill -vf -t 0 -o ' + filename, function (error, stdout, stderr) {
    if (error === null) {
      path.exists(filename, function(exists){
        if (exists) {
          fs.readFile(filename, function(error, content) {
            if (error) {
              fiveHundred(response);
            }
            else {
              sendImage(response, content);
            }
          });
        } else {
          status.notFound(response);
        }
      });
    } else {
      fiveHundred(response);
    }
  });
};

module.exports.takeStill = takeStill;
