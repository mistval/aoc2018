const fs = require('fs');
const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');
const lines = input.split('\n');

const dependenciesForStep = {};
const dependentsForStep = {};
const allSteps = [];

lines.forEach((line) => {
  const dependent = line.replace('Step ', '')[0];
  const dependency = line.replace(' can begin.', '')[line.replace(' can begin.', '').length - 1];

  dependenciesForStep[dependency] = dependenciesForStep[dependency] || [];
  dependenciesForStep[dependency].push(dependent);

  dependentsForStep[dependent] = dependentsForStep[dependent] || [];
  dependentsForStep[dependent].push(dependency);

  dependenciesForStep[dependent] = dependenciesForStep[dependent] || [];
  dependentsForStep[dependency] = dependentsForStep[dependency] || [];

  if (allSteps.indexOf(dependent) === -1) {
    allSteps.push(dependent);
  }

  if (allSteps.indexOf(dependency) === -1) {
    allSteps.push(dependency);
  }
});

allSteps.sort();

function getCanDo(done, inProgress = []) {
  const canDo = [];
  allSteps.forEach((stepToDo) => {
    if (done.indexOf(stepToDo) === -1
      && inProgress.indexOf(stepToDo) === -1
      && dependenciesForStep[stepToDo].every(dependency => done.indexOf(dependency) !== -1)
    ) {
      canDo.push(stepToDo);
    }
  });

  return canDo.sort();
}

function solveP1() {
  const done = [];

  let canDo = getCanDo(done);
  while (canDo.length > 0) {
    const toDo = canDo.shift();
    done.push(toDo);
    canDo = getCanDo(done);
  }

  console.log(`Part 1: ${done.join('')}`);
}

function solveP2() {
  class Worker {
    constructor() {
      this.job = '';
      this.timeToComplete = -1;
    }
  }

  const workers = [new Worker(), new Worker(), new Worker(), new Worker(), new Worker()];
  const done = [];

  let second = 0;
  while (true) {
    if (done.length === allSteps.length) {
      break;
    }

    workers.filter(worker => worker.job).forEach(worker => {
      worker.timeToComplete -= 1;
      if (worker.timeToComplete === 0) {
        done.push(worker.job)
        worker.job = '';
      }
    });

    const inProgress = workers.map(worker => worker.job).filter(job => job);
    const canDo = getCanDo(done, inProgress);

    workers.filter(worker => !worker.job).forEach((freeWorker) => {
      const doNow = canDo.shift();
      if (doNow) {
        freeWorker.job = doNow;
        freeWorker.timeToComplete = 60 + doNow.codePointAt(0) - 'A'.codePointAt(0) + 1;
      }
    });

    second += 1;
  }

  console.log(`Part 2: ${second - 1}`);
}

solveP1();
solveP2();