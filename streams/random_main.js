var Random = require('./random');
var Filter = require('./filter');
var Result = require('./result');

// Stream
var random = new Random();

// Transform
var filter = new Filter();

// Writable
var result = new Result();

// Generate random numbers, pipe the stream to the filtering stream
// then pipe this to the result Writable, which prints the numbers to the console
random.pipe(filter).pipe(result);
