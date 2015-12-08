var http = require('http');

/*
LESSON 1: EXERCISE 1

var server = http.createServer(function(request, response) {
    if (request.url == '/') {
        response.write('Hello World');
    // Jedi stuff
    } else if (request.url.substring(0,5) == '/jedi') {
		response.write('Hello' + request.url.substring(5).split('/').join(' '));
    } else {
        response.write('Hello' + request.url.split('/').join(' '));
    }
    response.end();
});
*/

// LESSON 1: EXERCISE 2
var server = http.createServer(function(request, response) {
    if (request.url == '/headers') {
        response.write(JSON.stringify(request.headers));
    } else if (request.url.substring(0,8) == '/headers') {
    	// Grab everything after '/headers/'
    	if (request.url.substring(9) in request.headers) {
    		response.write(request.headers[request.url.substring(9)]);
    	} else {
    		response.write('Header not found.');
    	}
    } else if (request.url == '/version') {
    	response.write(request.httpVersion);
    } else {
        response.write('Hello' + request.url.split('/').join(' '));
    }
    response.end();
});

server.listen(8080);

exports.server = server;