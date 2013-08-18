var exec = require('child_process').exec;
var fs = require('fs');
var status = require('./status');

function sendImage(response, filename){
  fs.stat(filename, function(error, stat) {
    var rs;
    response.writeHead(200, {
      'Content-Type' : 'image/jpeg',
      'Content-Length' : stat.size
    });
    rs = fs.createReadStream(filename);
    rs.pipe(response);
    rs.on('end', function() {
      fs.unlink(filename, function (err) {
        if (err) throw err;
      });
    });
  });
};

function takeStill(response){
  // take a still photo and send it back in the response
  var date = new Date()
  var filename = '/home/pi/rascam/server/(date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + '-' + date.getTime() + '.jpg';
  exec('raspistill -vf -t 0 -e jpg -q 75 -o ' + filename + ' -w 640 -h 480', function (error, stdout, stderr) {
    if (error === null) {
      fs.exists(filename, function(exists){
        if (exists) {
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
