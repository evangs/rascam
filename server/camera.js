var exec = require('child_process').exec;

function takeStill(response){
	// take a still photo and send it back in the response
	exec('raspistill -vf -t 0 -o -', function (error, stdout, stderr) {
		if (error === null) {
			response.writeHead(200, { 'Content-Type': 'image/jpg' });
			response.end(stdout, 'binary');
		} else {
			response.writeHead(500, { 'Content-Type': 'text/plain' });
			response.end('error taking still', 'utf-8');
		}
	});
};

module.exports.takeStill = takeStill;
