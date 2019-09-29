export default class SessionTracker {
  constructor(
    timeTracker,
    idleTimeout = 0,
    useEstimatedSessionTiming = false,
    logging = false
  ) {
    this.sessionTime = null;
    this.useEstimatedSessionTiming = useEstimatedSessionTiming;
    this.idleTimeout = idleTimeout;
    this.timeTracker = timeTracker;
    this.pageTimes = [];
    this.running = false;
    this.logging = logging;
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
    let sessionDuration = this.timeTracker.stopTimer("session");
    const pageCorrection = this.calcuatePageCorrection();
    this.resetPageTimes();

    if (this.useEstimatedSessionTiming) {
      const correction = this.idleTimeout + pageCorrection;
      const newSessionDuration = sessionDuration - correction;

      if (this.logging > 1) {
        console.log(
          `[SESSION] applying length correction of -${correction / 1000} S`
        );
        console.log(
          `[SESSION] was ${sessionDuration / 1000} S, now ${newSessionDuration /
            1000} S`
        );
      }
      sessionDuration = newSessionDuration;
    }
    return sessionDuration;
  };

  addPageTime(time) {
    time && this.pageTimes.push(time);
  }

  calcuatePageCorrection() {
    if (this.pageTimes.length === 0) {
      return;
    }

    /*
      The page correction we apply is the mean of the page view duration in 
      the session just ended PLUS one standard deviation.
      See the docs for more information.
    */

    const mean = this.calculateMean(this.pageTimes);
    const sd = this.calculateSD(this.pageTimes);

    return Math.round(mean + sd);
  }

  // Hat tip: https://dustinpfister.github.io/2018/02/20/statistics-standard-deviation/
  calculateMean(data) {
    return (
      data.reduce(function(a, b) {
        return Number(a) + Number(b);
      }) / data.length
    );
  }

  calculateSD(data) {
    let m = this.calculateMean(data);
    return Math.sqrt(
      data.reduce(function(sq, n) {
        return sq + Math.pow(n - m, 2);
      }, 0) /
        (data.length - 1)
    );
  }

  resetPageTimes() {
    this.pageTimes = [];
  }
}
