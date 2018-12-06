const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8');
const linesSorted = input.split('\n').sort();

const EventType = {
  START: 1,
  SLEEP: 2,
  WAKE: 3,
};

let guardId = '';
const events = linesSorted.map(line => {
  const timestamp = line.substr(0, line.indexOf(']') + 1);
  let eventType = 0;
  if (line.indexOf('falls asleep') !== -1) {
    eventType = EventType.SLEEP;
  } else if (line.indexOf('wakes up') !== -1) {
    eventType = EventType.WAKE;
  } else if (line.indexOf('begins shift') !== -1) {
    eventType = EventType.START;
    guardId = line.split(' ')[3].replace('#', '');
  } else {
    throw new Error(`Unexpected event in line: ${line}`);
  }

  const [hour, minute] = timestamp.split(' ')[1].replace(']', '').split(':');

  return {
    eventType,
    guardId: parseInt(guardId),
    hour: parseInt(hour),
    minute: parseInt(minute),
  };
});

const sleepPeriodsForGuard = {};
let sleepTime = 0;
events.forEach((event) => {
  if (!sleepPeriodsForGuard[event.guardId]) {
    sleepPeriodsForGuard[event.guardId] = [];
  }
  if (event.eventType === EventType.SLEEP) {
    sleepTime = event.minute;
  }
  if (event.eventType === EventType.WAKE) {
    const wakeTime = event.minute;
    const sleepLength = wakeTime - sleepTime - 1;
    sleepPeriodsForGuard[event.guardId].push({ sleepTime, wakeTime, sleepLength });
  }
});

function solveP1() {
  const sleepTimeForGuard = {};
  Object.keys(sleepPeriodsForGuard).forEach((guardId) => {
    sleepTimeForGuard[guardId] = sleepPeriodsForGuard[guardId].reduce((sum, period) => sum + period.sleepLength, 0);
  });

  let maxSleepTime = 0;
  let maxGuardId = 0;

  Object.keys(sleepTimeForGuard).forEach((guardId) => {
    const sleepTime = sleepTimeForGuard[guardId];
    if (sleepTime >= maxSleepTime) {
      maxSleepTime = sleepTime;
      maxGuardId = guardId;
    }
  });

  const timesAsleepForMinute = {};
  let maxMinute;
  sleepPeriodsForGuard[maxGuardId].forEach((sleepPeriod) => {
    for (let i = sleepPeriod.sleepTime; i < sleepPeriod.wakeTime; i += 1) {
      if (!timesAsleepForMinute[i]) {
        timesAsleepForMinute[i] = 1;
      } else {
        timesAsleepForMinute[i] += 1;
      }

      if (!maxMinute || timesAsleepForMinute[i] > timesAsleepForMinute[maxMinute]) {
        maxMinute = i;
      }
    }
  });

  const solution = maxGuardId * maxMinute;
  console.log(`Part 1: ${solution}`);
}

function solveP2() {
  const timesAsleepForMinutePerGuard = {};
  Object.keys(sleepPeriodsForGuard).forEach((guardId) => {
    if (!timesAsleepForMinutePerGuard[guardId]) {
      timesAsleepForMinutePerGuard[guardId] = {};
    }
    const timesAsleepForMinute = timesAsleepForMinutePerGuard[guardId];
    sleepPeriodsForGuard[guardId].forEach((sleepPeriod) => {
      for (let i = sleepPeriod.sleepTime; i < sleepPeriod.wakeTime; i += 1) {
        if (!timesAsleepForMinute[i]) {
          timesAsleepForMinute[i] = 1;
        } else {
          timesAsleepForMinute[i] += 1;
        }
      }
    });
  });

  let maxGuardId;
  let maxMinute;
  let maxTimeAsleep = 0;

  Object.keys(timesAsleepForMinutePerGuard).forEach((guardId) => {
    Object.keys(timesAsleepForMinutePerGuard[guardId]).forEach((minute) => {
      const timeAsleep = timesAsleepForMinutePerGuard[guardId][minute];
      if (timeAsleep > maxTimeAsleep) {
        maxTimeAsleep = timeAsleep;
        maxMinute = minute;
        maxGuardId = guardId;
      }
    });
  });

  const solution = maxGuardId * maxMinute;
  console.log(`Part 2: ${solution}`);
}

solveP1();
solveP2();