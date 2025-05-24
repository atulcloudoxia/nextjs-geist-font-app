import { LightningElement, track } from 'lwc';

export default class TimeTrackerApp extends LightningElement {
    @track activeTab = 'timeEntries';

    handleTabChange(event) {
        this.activeTab = event.target.value;
    }
}
