import { LightningElement, track, wire } from 'lwc';
import getTimeEntries from '@salesforce/apex/TimeEntryController.getTimeEntries';

export default class TimeEntryList extends LightningElement {
    @track timeEntries = [];

    @wire(getTimeEntries)
    wiredTimeEntries({ error, data }) {
        if (data) {
            this.timeEntries = data;
        } else if (error) {
            this.timeEntries = [];
            console.error('Error fetching time entries', error);
        }
    }
}
