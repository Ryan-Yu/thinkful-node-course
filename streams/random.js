/*
Readable that produces a list of 200 random numbers
*/
var stream = require('stream');

function Random(options) {
    // Inherits from stream.Readable
    stream.Readable.call(this, options);
    this._counter = 1;
};

Random.prototype = Object.create(stream.Readable.prototype);
Random.prototype.constructor = stream.Readable;

// Called whenever data is required from the stream
Random.prototype._read = function() {
    // Generate a random number between 1 and 200
    var randomNumber = Math.floor((Math.random() * 200) + 1);
    var buf = new Buffer(randomNumber.toString());

    this.push(buf);
    this._counter++;
    // Generate 200 random numbers, then stop by pushing null
    if (this._counter > 200) {
        this.push(null);
    }
};

module.exports = Random;