export class Timer {
    constructor(onTick) {
        this.onTick = onTick;       // function to run every second
        this.startTime = null;
        this.endTime = null;
        this.intervalId = null;
    }

    start() {
        this.startTime = Date.now();
        this.endTime = null;
        this.intervalId = setInterval(() => {
            this.onTick(this.getSeconds());
        }, 1000);
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.endTime = Date.now();
    }

    reset() {
        this.stop();
        this.startTime = null;
        this.endTime = null;
    }

    hasStarted() {
        return this.startTime !== null;
    }

    getSeconds() {
        if (this.startTime === null) {
            return 0;
        }
        // After stop(), measure up to when it stopped, not up to now
        const end = this.endTime ?? Date.now();
        return (end - this.startTime) / 1000;
    }
}