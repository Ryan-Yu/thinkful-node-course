var Alphabet = require('./alphabet');
var Cache = require('./cache');

// Stream
var alpha = new Alphabet();

// Writable
var cache = new Cache({ key: 'alpha1' });

// Pipe the data from the Alphabet stream into the Cache
// Repeatedly calls the ._write method in the cache (for each chunk of data that comes into it)
alpha.pipe(cache);

cache.on('finish', function() {
	// Cache.store shared between every Cache object
	console.log('cache store:', Cache.store['alpha1']);
	console.log('converted version:', Cache.store['alpha1'].toString('utf8'));
});
