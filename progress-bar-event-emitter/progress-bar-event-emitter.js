var events = require('events');

var progressBar = new events.EventEmitter();

progressBar.on('start', function() {
	console.log('Beginning counter.');
});

progressBar.on('progress', function(index) {
	if (index % 10 === 0) {
		console.log('Progress: ' + index);
	}
});

progressBar.on('end', function() {
	console.log('Finished counting.');
});

// Begin execution
progressBar.emit('start');
for (var i = 1; i <= 100; i++) {
	progressBar.emit('progress', i);
}
progressBar.emit('end');