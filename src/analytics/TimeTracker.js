class TimeTracker {
  constructor() {
    this.timers = {};
  }

  reset() {
    this.timers = {};
  }

  startTimer(key, time = new Date()) {
    if (!(key in this.timers)) {
      this.timers[key] = time;
    }
  }

  restartTimer(key, time = new Date()) {
    const elapsed = this.checkTime(key);

    this.timers[key] = new Date();

    return elapsed;
  }

  stopTimer(key) {
    const elapsed = this.checkTime(key);

    delete this.timers[key];

    return elapsed;
  }

  checkTime(key) {
    let elapsed = null;
    const startedAt = this.timers[key];

    if (startedAt) {
      const currentTime = new Date();
      elapsed = currentTime - startedAt;
      this.timers[key] = currentTime;
    }

    return elapsed;
  }
}

const timeTracker = new TimeTracker();

export default timeTracker;
