var http = require('http');
var url = require('url');
var fs = require('fs');
var static = require('node-static');

var Cache = require('./cache');

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
};

Storage.prototype.delete = function(id) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id === parseInt(id)) {
            var deletedItem = this.items[i];
            this.items.splice(i, 1);
            return deletedItem;
        }
    }
    throw "Item ID not found";
};

// Changes name of item with id 'id', and creates a new item with id 'id' and name 'name' if id is not found already
Storage.prototype.changeName = function(id, name) {
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].id === parseInt(id)) {
            this.items[i].name = name;
            return this.items[i];
        }
    }
    // Add item with id 'id' if not found already
    var item = {name: name, id: id};
    this.items.push(item);
    console.log("Now there are " + this.items.length + ' items');
    return item;
}

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

// Serves front end code (specifying location of public folder)
var fileServer = new static.Server('./public');

// Each request processed inside the createServer callback function
var server = http.createServer(function (req, res) {
    // Check that the request is using the GET method & specifies /items as the URL
    if (req.method === 'GET' && req.url === '/items') {
        var responseData = JSON.stringify(storage.items);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(responseData);
    }
    else if (req.method === 'POST' && req.url === '/items') {
        var item = '';
        // Can't access the request body directly by doing req.body
        // because request body can be an arbitrary length and can be appended to at any time
        req.on('data', function (chunk) {
            // the request body is a readable stream
            // can intercept the stream using the data event, so need to concatenate all of the
            // Buffer object chunks that are provided in the 'data' event until the request stream has ended
            item += chunk;
        });
        // The 'end' event handler of the request stream
        req.on('end', function () {
            try {
                item = JSON.parse(item);
                storage.add(item.name);
                res.statusCode = 201;
                res.end();
            }
            catch(e) {
                res.statusCode = 400;
                responseData = {'message': 'Invalid JSON'};
                res.end(JSON.stringify(responseData));
            }
        });
    }
    // Adding a DELETE endpoint for /items/<id>
    else if (req.method === 'DELETE' && req.url.substring(0, 6) === '/items') {
        try {
            storage.delete(req.url.substring(6).split('/')[1]);
        }
        // If ID cannot be found, endpoint fails gracefully, returning a JSON error message
        catch(e) {
            res.statusCode = 400;
            responseData = {'message': 'Item ID not found'};
            res.end(JSON.stringify(responseData));
        }
    }
    else if (req.method === 'PUT' && req.url.substring(0, 6) === '/items') {
        var item = '';
        // Grab request body in chunks
        req.on('data', function (chunk) {
            item += chunk;
        });
        req.on('end', function () {
            try {
                item = JSON.parse(item);
                // Change the name if item.id exists, else add a new item with id item.id
                storage.changeName(item.id, item.name);
                res.statusCode = 201;
                res.end();
            }
            catch(e) {
                res.statusCode = 400;
                responseData = {'message': 'Invalid JSON'};
                res.end(JSON.stringify(responseData));
            }
        });
    }
    else {
        // Without this statement any request that is not GET /items would never be processed by the code
        // This would leave connections hanging indefinitely -- no response would be given to the client
        // to let them know what happened.
        // Instead, the fileServer.serve function is called to attempt to serve a file from the 'public' directory

        // Playing around with piping to the cache...
        var pathname = url.parse(req.url).pathname;
        var filename = '.' + pathname;

        // Try to find an entry in our cache that has the key 'filename'
        // If it does not exist, then add it to the cache

        // If filename is in our cache... then serve it
        if (filename in Cache) {
            // Serve the file
        }
        // If filename is not in our cache... then pipe it into our cache with key 'filename'
        else {
            // Instantiate the cache
            var cache = new Cache({ key: filename });

            // Pipe the contents of the filename to the cache
            fs.createReadStream(filename).on('error', function(e) {
                'error', function(e) {
                    console.error(e);
                    res.removeHeader('content-encoding');
                    res.statusCode = 404;
                    res.end('Not Found');
                }
            })
            .pipe(cache);
        }

        fileServer.serve(req, res);
    }
});

server.listen(8080, function() {
    console.log('listening on localhost:8080');
});