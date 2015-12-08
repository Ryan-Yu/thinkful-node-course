var ProgressBar = function() {
	this.onStartCallback = null;
	this.onProgressCallback = null;
	this.onEndCallback = null;
	var index = 1;
};

// Simply registers a callback function by saving it in the ProgressBar object as this.onStartCallback
ProgressBar.prototype.onStart = function(callback) {
	this.onStartCallback = callback;
};

// Simply registers a callback function by saving it in the ProgressBar object as this.onProgressCallback
ProgressBar.prototype.onProgress = function(callback) {
	this.onProgressCallback = callback;
};

// Simply registers a callback function by saving it in the ProgressBar object as this.onEndCallback
ProgressBar.prototype.onEnd = function(callback) {
	this.onEndCallback = callback;
};

////////////////////////////////////

var progressBar = new ProgressBar();

// Register onStart callback with progressBar object
progressBar.onStart(function() {
	console.log('Beginning counter.');
});

// Register onProgress callback with progressBar object
progressBar.onProgress(function(index) {
	if (index % 10 === 0) {
		console.log('Status: ' + index);
	}
});

// Register onEnd callback with progressBar object
progressBar.onEnd(function() {
	console.log('Counting finished.');
});

// When the start function is called, it should call the onStart callback, and begin count from 1 - 100
ProgressBar.prototype.start = function() {
	this.onStartCallback();
	for (var i = 1; i <= 100; i++) {
		this.onProgressCallback(i);
	}
	this.onEndCallback();
};

// ----- Begin execution ----- //
progressBar.start();
