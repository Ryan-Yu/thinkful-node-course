var events = require('events');

var player = new events.EventEmitter();

player.on('start', function(artist, song) {
	console.log('Starting audio stream playing', artist, song);
});

player.on('stop', function() {
	console.log('Stopping audio stream');
});

player.on('start', function() {
	console.log('Updating UI to started state');
});

player.on('stop', function() {
	console.log('Updating UI to stopped state');
});

player.emit('start', 'Sleater Kinney', 'No Cities to Love');
player.emit('stop');