const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');

const lines = input.split('\n').map(l => l.trim());
const nums = lines.map(line => {
	let operator = line.substr(0, 1);
	let value = parseInt(line.substr(1));
	
	if (operator === '+') {
		return value;
	} else {
		return -value;
	}
});

function solveP1() {
	const solution = nums.reduce((total, num) => total + num);
	console.log(`Part 1: ${solution}`);
}

function solveP2() {
	let total = 0;
	const seen = {};
	while (true) {
		for (let num of nums) {
			if (seen[total]) {
				console.log(`Part 2: ${total}`);
				return;
			}
			
			seen[total] = true;
			total += num;
		}
	}
}

solveP1();
solveP2();