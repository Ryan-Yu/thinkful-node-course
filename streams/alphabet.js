var stream = require('stream');

function Alphabet(options) {
    // Inherits from the stream.Readable object, allowing it to be used as a readable stream
    stream.Readable.call(this, options);
    this._start = 'a';
    this._end = 'z';
    this._curr = this._start.charCodeAt(0);
};
Alphabet.prototype = Object.create(stream.Readable.prototype);
Alphabet.prototype.constructor = stream.Readable;

// Called whenever data is required from the Readable
Alphabet.prototype._read = function() {
    var letter = String.fromCharCode(this._curr);
    var buf = new Buffer(letter, 'utf8');
    // To output a letter from the _read method, you push it onto the buffer using 'push' method
    this.push(buf);
    this._curr++;
    if (letter === this._end) {
        // Once you're finished iterating, you can tell the buffer that the data has ended by calling push(null)
        this.push(null);
    }
};

module.exports = Alphabet;