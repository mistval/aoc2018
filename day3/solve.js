const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const lines = input.split('\n');

const claims = lines.map((line) => {
  const parts = line.split(' ');
  const id = parts[0].replace('#', '');
  const [x, y] = parts[2].replace(':', '').split(',');
  const [width, height] = parts[3].split('x');

  return {
    id,
    x: parseInt(x) + 1,
    y: parseInt(y) + 1,
    width: parseInt(width),
    height: parseInt(height),
  };
});

let doubleClaimedCount = 0;
let claimedSquares = {};

claims.forEach((claim) => {
  for (let x = claim.x; x < claim.x + claim.width; x += 1) {
    if (!claimedSquares[x]) {
      claimedSquares[x] = {};
    }
    for (let y = claim.y; y < claim.y + claim.height; y += 1) {
      if (!claimedSquares[x][y]) {
        claimedSquares[x][y] = 0;
      }
      claimedSquares[x][y] += 1;

      if (claimedSquares[x][y] === 2) {
        doubleClaimedCount += 1;
      }
    }
  }
});

function solveP1() {
  console.log(`Part 1: ${doubleClaimedCount}`);
}

function solveP2() {
  claims.forEach((claim) => {
    for (let x = claim.x; x < claim.x + claim.width; x += 1) {
      for (let y = claim.y; y < claim.y + claim.height; y += 1) {
        if (claimedSquares[x][y] !== 1) {
          return;
        }
      }
    }
    console.log(`Part 2: ${claim.id}`);
  });
}

solveP1();
solveP2();
