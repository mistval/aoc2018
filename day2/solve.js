const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');

const lines = input.split('\n');
const charArrs = lines.map(line => line.split(''));
const charArrsSorted = charArrs.map(arr => arr.slice().sort());

function countHas(x) {
  let sum = 0;
  charArrsSorted.forEach((charArrSorted) => {
    let previousChar = '';
    let count = 0;
    for (let i = 0; i < charArrSorted.length; i += 1) {
      const char = charArrSorted[i];
      if (char === previousChar) {
        count += 1;
        if (count === x && (i === charArrSorted.length - 1 || charArrSorted[i + 1] !== previousChar)) {
          sum += 1;
          break;
        }
      } else {
        count = 1;
        previousChar = char;
      }
    }
  });

  return sum;
}

function solveP1() {
  const with2 = countHas(2);
  const with3 = countHas(3);
  const solution = with2 * with3;

  console.log(`Part 1: ${solution}`);
}

function solveP2() {
  for (let c1i = 0; c1i < charArrs.length; c1i += 1) {
    for (let c2i = c1i + 1; c2i < charArrs.length; c2i += 1) {
      const charArr1 = charArrs[c1i];
      const charArr2 = charArrs[c2i];
      let differentCharPos = -1;

      for (let ci = 0; ci < charArr1.length; ci += 1) {
        const char = charArr1[ci];
        if (char !== charArr2[ci]) {
          if (differentCharPos !== -1) {
            differentCharPos = -1;
            break;
          } else {
            differentCharPos = ci;
          }
        }
      }

      if (differentCharPos !== -1) {
        const str = charArr1.join('');
        const solution = str.substr(0, differentCharPos) + str.substr(differentCharPos + 1);
        return console.log(`Part 2: ${solution}`);
      }
    }
  }
}

solveP1();
solveP2();