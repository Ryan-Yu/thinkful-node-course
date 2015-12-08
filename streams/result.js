var stream = require('stream');

function Result(options) {
    stream.Writable.call(this, options);
};

Result.prototype = Object.create(stream.Writable.prototype);
Result.prototype.constructor = stream.Writable;

// When data is received, simply print it out to the console after it has been decoded
Result.prototype._write = function(chunk, encoding, callback) {
    console.log(chunk.toString('utf8'));
    callback();
};

module.exports = Result;