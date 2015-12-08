/*
Filter stream that gets rid of all incoming numbers that are greater than 100
*/

var stream = require('stream');

function Filter(options) {
	stream.Transform.call(this, options);
};

Filter.prototype = Object.create(stream.Transform.prototype);
Filter.prototype.constructor = stream.Transform;

Filter.prototype._transform = function(chunk, encoding, callback) {
	// Only let through chunks that have values equal to or less than 100
	if (parseInt(chunk.toString('utf8')) <= 100) {
		this.push(chunk);
	}
	callback();
};

module.exports = Filter;