const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const lines = input.split('\n');
const coordinates = lines
  .map(line => line.split(', ').map(c => parseInt(c)))
  .map(pair => ({ x: pair[0], y: pair[1], size: 0 }));

let gridStartX = coordinates[0].x;
let gridStartY = coordinates[0].y;
let gridEndX = coordinates[0].x;
let gridEndY = coordinates[0].y;

coordinates.forEach((pair) => {
  gridStartX = Math.min(gridStartX, pair.x);
  gridStartY = Math.min(gridStartY, pair.y);
  gridEndX = Math.max(gridEndX, pair.x);
  gridEndY = Math.max(gridEndY, pair.y);
});

const distances = {};
for (let x = gridStartX; x <= gridEndX; x += 1) {
  distances[x] = {};
  for (let y = gridStartY; y <= gridEndY; y += 1) {
    distances[x][y] = {
      minDistance: Number.MAX_SAFE_INTEGER,
      minPairIndex: -1,
      distances: new Array(coordinates.length),
    };
  }
}

coordinates.forEach((pair, pairIndex) => {
  for (let x = gridStartX; x <= gridEndX; x += 1) {
    for (let y = gridStartY; y <= gridEndY; y += 1) {
      const distance = Math.abs(pair.x - x) + Math.abs(pair.y - y);
      distances[x][y].distances[pairIndex] = distance;
      if (distance < distances[x][y].minDistance) {
        distances[x][y].minDistance = distance;
        distances[x][y].minPairIndex = pairIndex;
      }
    }
  }

  for (let x = gridStartX; x <= gridEndX; x += 1) {
    for (let y = gridStartY; y <= gridEndY; y += 1) {
      const distance = Math.abs(pair.x - x) + Math.abs(pair.y - y);
      if (distance === distances[x][y].minDistance && pairIndex !== distances[x][y].minPairIndex) {
        distances[x][y].minPairIndex = -1;
      }
    }
  }
});

for (let x = gridStartX; x <= gridEndX; x += 1) {
  const minTop = distances[x][gridStartY].minPairIndex;
  const minBottom = distances[x][gridEndY].minPairIndex;

  if (minTop !== -1) {
    coordinates[minTop].infinite = true;
  }
  
  if (minBottom !== -1) {
    coordinates[minBottom].infinite = true;
  }
}

for (let y = gridStartY; y <= gridEndY; y += 1) {
  const minLeft = distances[gridStartX][y].minPairIndex;
  const minRight = distances[gridEndX][y].minPairIndex;

  if (minLeft !== -1) {
    coordinates[minLeft].infinite = true;
  }

  if (minRight !== -1) {
    coordinates[minRight].infinite = true;
  }
}

for (let x = gridStartX; x <= gridEndX; x += 1) {
  for (let y = gridStartY; y <= gridEndY; y += 1) {
    const minIndex = distances[x][y].minPairIndex;

    if (minIndex !== -1) {
      coordinates[minIndex].size += 1;
    }
  }
}

function solveP1() {
  let maxSize = 0;
  coordinates.forEach((pair) => {
    if (pair.size > maxSize && !pair.infinite) {
      maxSize = pair.size;
    }
  });

  console.log(`Part 1: ${maxSize}`);
}

function solveP2() {
  let regionSize = 0;
  for (let x = gridStartX; x <= gridEndX; x += 1) {
    for (let y = gridStartY; y <= gridEndY; y += 1) {
      const distanceTotal = distances[x][y].distances.reduce((total, d) => total + d, 0);
      if (distanceTotal < 10000) {
        regionSize += 1;
      }
    }
  }

  console.log(`Part 2: ${regionSize}`);
}

solveP1();
solveP2();