var http = require('http');
var https = require('https');
var static = require('node-static');
var events = require('events');
var querystring = require('querystring');

var getFromApi = function(endpoint, args) {
    var emitter = new events.EventEmitter();
    var options = {
        host: 'api.spotify.com',
        path: '/v1/' + endpoint + querystring.stringify(args)
        // (for search:) GET https://api.spotify.com/v1/search
        // (for related artists:) GET https://api.spotify.com/v1/artists/{id}/related-artists
    };

    var item = '';
    var searchReq = https.get(options, function(response) {
        response.on('data', function(chunk) {
            item += chunk;
        });
        response.on('end', function() {
            item = JSON.parse(item);
            emitter.emit('end', item);
        });
        response.on('error', function() {
            emitter.emit('error');
        });
    });
    return emitter;
};



// Create HTTP server using node-static to serve the front end
var fileServer = new static.Server('./public');
var server = http.createServer(function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (req.method == "GET" && req.url.indexOf('/search') == 0) {
        var name = req.url.split('/')[2];
        // Call getFromApi with the correct parameters (taken from the request URL)
        // NOTE: searchReq is an emitter, but it emits 'end' from inside the getFromApi method...
        var searchReq = getFromApi('search?', {
            q: name,
            limit: 1,
            type: 'artist'
        });

        // Called when the 'end' event is emitted from searchReq
        // i.e. when emitter.emit('end', item) is called
        // Can then pull the artist from the JSON of the output (that was created with JSON.parse(item))
        searchReq.on('end', function(item) {
            
            // Grab the artist from the .artists attribute of the item returned by the emitter
            var artist = item.artists.items[0];

            if (!(typeof artist === 'undefined')) {
                // At this point, the search request is DONE.
                var relatedSearchReq = getFromApi('artists/' + artist.id + '/related-artists');

                // ... so we can make another API call and dictate what happens when all of its callbacks have returned
                relatedSearchReq.on('end', function(item) {
                    var relatedArtists = item.artists;
                    artist.related = relatedArtists;

                    // Keep a counter of how many artists have finished
                    artistTopTracksCompleted = 0;

                    artist.related.forEach(function(relatedArtist) {

                        // For each one of these IDs, send a request to the top tracks endpoints:
                        // GET https://api.spotify.com/v1/artists/{id}/top-tracks
                        // i.e. "GET https://api.spotify.com/v1/artists/43ZHCT0cAZBISjO8DG9PnE/top-tracks?country=SE"
                        // If successful, then set the related artist's.tracks = item.tracks,
                        // where item is the object returned by the related artists endpoint
                        var topTracksReq = getFromApi('artists/' + relatedArtist.id + '/top-tracks?', {
                            country: 'US'
                        });

                        topTracksReq.on('end', function(item) {
                            var topTracks = item.tracks;
                            relatedArtist.tracks = topTracks;
                            artistTopTracksCompleted += 1;

                            // When we have found the top tracks for every related artist, then signal that our response should be ended.
                            if (artistTopTracksCompleted === artist.related.length) {
                                res.end(JSON.stringify(artist));
                            }
                        });

                        topTracksReq.on('error', function() {
                            res.statusCode = 404;
                            res.end();
                        });
                    });
                });
                relatedSearchReq.on('error', function() {
                    res.statusCode = 404;
                    res.end();
                });
            }

        });

        searchReq.on('error', function() {
            res.statusCode = 404;
            res.end();
        });
        
    }
    else {
        fileServer.serve(req, res);
    }
});

server.listen(8080);