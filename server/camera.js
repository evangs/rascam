var exec = require('child_process').exec;
var fs = require('fs');
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
    rs.pipe(response);
  });
};

function takeStill(response){
  // take a still photo and send it back in the response
  var date = new Date()
  var filename = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + '-' + date.getTime() + '.jpg';
  exec('raspistill -vf -t 0 -e jpg -q 75 -o ' + filename + ' -w 640 -h 480', function (error, stdout, stderr) {
    if (error === null) {
      fs.exists(filename, function(exists){
        if (exists) {
          console.log('about to send image');
          sendImage(response, filename);
          fs.unlinkSync(filename);
        } else {
          status.notFound(response);
        }
      });
    } else {
      status.serverError(response);
    }
  });
};

function staticImage(response){
  var filename = 'testimg.jpg';
  fs.exists(filename, function(exists){
    if (exists) {
      console.log('about to send image');
      sendImage(response, filename);
    } else {
      status.notFound(response);
    }
  });
};

module.exports.takeStill = takeStill;
module.exports.staticImage = staticImage;
