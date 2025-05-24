import { LightningElement, track } from 'lwc';

export default class TimeEntryTimer extends LightningElement {
    @track time = 0;
    timerInterval;
    isRunning = false;

    get formattedTime() {
        const hours = Math.floor(this.time / 3600);
        const minutes = Math.floor((this.time % 3600) / 60);
        const seconds = this.time % 60;
        return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }

    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerInterval = setInterval(() => {
                this.time++;
            }, 1000);
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
        }
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        // Dispatch event to notify parent component to save time entry
        this.dispatchEvent(new CustomEvent('stop', { detail: { duration: this.time } }));
        this.time = 0;
    }
}
