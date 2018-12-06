const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');

function getReactedLength(str) {
  let reactedString = str;
  let reactIndex = 0;
  while (reactIndex < reactedString.length - 1) {
    const c = reactedString[reactIndex];
    const n = reactedString[reactIndex + 1];

    if (
      (c.toUpperCase() === c && c.toLowerCase() === n)
      || (c.toLowerCase() === c && c.toUpperCase() === n)
      ) {
        reactedString = reactedString.substr(0, reactIndex) + reactedString.substr(reactIndex + 2);
        reactIndex = Math.max(reactIndex - 1, 0);
      } else {
        reactIndex += 1;
      }
  }

  return reactedString.length;
}

function solveP1() {
  const solution = getReactedLength(input);
  console.log(`Part 1: ${solution}`);
}

function solveP2() {
  let min = input.length;
  for (let char = 'a'; char <= 'z'; char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    const replacedInput = input.replace(new RegExp(char, 'ig'), '');
    const reactedLength = getReactedLength(replacedInput);
    min = Math.min(min, reactedLength);
  }

  console.log(`Part 2: ${min}`);
}

solveP1();
solveP2();