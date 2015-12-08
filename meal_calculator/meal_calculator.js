console.log("Welcome to the meal cost calculator application!");
console.log("This application will let you add diners, and the dishes that each diner consumed.");
console.log("It will also let you specify a tip amount, and a tax amount.");
console.log("A fair split bill will then be calculated and shown!\n");
console.log("Please follow the prompts. When you have finished entering in menu items for an individual diner, type 'next' to move on to the next diner.");
console.log("When you have finished with all diners, type 'done' to move on to the next steps.");

var prompt = require('prompt');

var Diner = function(dinerName, totalCost) {
	this.dinerName = dinerName;
	this.totalCost = totalCost;
};

// Start the prompt
prompt.start();

var diners = [];
var currentDinerName = "";
var currentDinerSum = 0.0;
var taxRate = 0.0;
var tipRate = 0.0;

function askPrice() {
	prompt.get(['price'], function(err, result) {
		// Move on to the next diner
		// Instantiate a diner object with the corresponding price and reset the current diner sum
		if (result.price === 'next') {
			console.log('  Moving on to the next diner.');
			var newDiner = new Diner(currentDinerName, currentDinerSum);
			diners.push(newDiner);
			console.log('  Added diner ' + currentDinerName + ' with total meal base cost ' + currentDinerSum);
			currentDinerSum = 0.0;

			// Move on to the next name
			askName();
		} else {
			currentDinerSum += parseFloat(result.price);
			console.log('  Current diner bill: ' + currentDinerSum);
			askPrice();
		}
	});
}

function askName() {
	prompt.get(['name'], function(err, result) {
		console.log('  Diner name: ' + result.name);
		currentDinerName = result.name;
		if (currentDinerName === 'done') {
			console.log('  All diners inputted.\n');

			// All diners inputted, so ask about the tax rate
			console.log('  What is the tax rate (in percent)?');
			askTax();
		} else {
			askPrice();
		}
	});
}

function askTax() {
	prompt.get(['rate'], function(err, result) {
		console.log('  Tax rate (percent): ' + result.rate + '\n');
		taxRate = parseFloat(result.rate);

		// Ask about the tip rate
		console.log('  What is the tip rate you want to give (in percent?)');
		askTip();
	});
}

function askTip() {
	prompt.get(['rate'], function(err, result) {
		console.log('  Tip rate (percent): ' + result.rate);
		tipRate = parseFloat(result.rate);

		// Perform calculations and print out to user
		performCalculations();
	});
}

function performCalculations() {
	console.log(diners);
	var totalBillCost = 0.0;

	console.log('Final bill breakdown:\n');
	console.log(diners);
	for (var i = 0; i < diners.length; i++) {
		var currentDinerTotal = (diners[i].totalCost * (taxRate / 100)) + (diners[i].totalCost * (tipRate / 100)) + diners[i].totalCost;
		totalBillCost += currentDinerTotal;
		console.log('Total for diner ' + diners[i].dinerName + ': ' + currentDinerTotal);
	}

	console.log('Total bill cost: ' + totalBillCost);
}

askName();
