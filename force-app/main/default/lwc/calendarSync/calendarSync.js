import { LightningElement, track, wire } from 'lwc';
import getCalendarEvents from '@salesforce/apex/CalendarSyncController.getCalendarEvents';
import syncCalendarEvents from '@salesforce/apex/CalendarSyncController.syncCalendarEvents';

export default class CalendarSync extends LightningElement {
    @track calendarEvents = [];
    @track isSyncing = false;

    @wire(getCalendarEvents)
    wiredCalendarEvents({ error, data }) {
        if (data) {
            this.calendarEvents = data;
        } else if (error) {
            this.calendarEvents = [];
            console.error('Error fetching calendar events', error);
        }
    }

    handleSync() {
        this.isSyncing = true;
        syncCalendarEvents()
            .then(() => {
                return getCalendarEvents();
            })
            .then((result) => {
                this.calendarEvents = result;
                this.isSyncing = false;
            })
            .catch((error) => {
                console.error('Error syncing calendar events', error);
                this.isSyncing = false;
            });
    }
}
