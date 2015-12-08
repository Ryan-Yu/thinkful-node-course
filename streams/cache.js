var stream = require('stream');

function Cache(options) {
    // Inherit from stream.Writable to implement a Writable stream
    // (and override ._write method)
    stream.Writable.call(this, options);
    this._key = options.key;
    this._value = null;

    // Called when the stream has finished
    this.on('finish', function() {
        Cache.store[this._key] = this._value;
    });
};
Cache.store = {};
Cache.prototype = Object.create(stream.Writable.prototype);
Cache.prototype.constructor = stream.Writable;

// Method called when data is supplied to the stream
Cache.prototype._write = function(chunk, encoding, callback) {
    // data is provided in the chunk parameter (can be either a String or Buffer)
    if (!this._value) {
        this._value = chunk;
    }
    else {
        // If you used += operator, it would coalesce into a String, so using
        // Buffer.concat allows you to retain the Buffer type

        // To convert each buffer's binary contents to string:
        // console.log(chunk.toString('utf8'));
        this._value = Buffer.concat([this._value, chunk]);
    }
    callback();
};

module.exports = Cache;