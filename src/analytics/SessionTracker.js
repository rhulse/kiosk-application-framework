export default class SessionTracker {
  constructor(timeTracker) {
    this.sessionTime = null;
    this.timeTracker = timeTracker;
    this.running = false;
  }

  start(currentPage) {
    if (this.running) {
      return;
    }
    this.running = true;

    this.timeTracker.startTimer("session");
  }

  end = () => {
    this.running = false;

    return this.timeTracker.stopTimer("session");
  };
}
