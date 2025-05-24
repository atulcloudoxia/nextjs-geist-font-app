import { LightningElement, track, wire } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FULLCALENDAR from '@salesforce/resourceUrl/fullcalendar'; // Assume fullcalendar is uploaded as a static resource
import getTimeEntries from '@salesforce/apex/TimeEntryController.getTimeEntries';
import updateTimeEntry from '@salesforce/apex/TimeEntryController.updateTimeEntry';

export default class TimeEntryCalendar extends LightningElement {
    @track timeEntries = [];
    calendarInitialized = false;

    renderedCallback() {
        if (this.calendarInitialized) {
            return;
        }
        this.calendarInitialized = true;

        Promise.all([
            loadScript(this, FULLCALENDAR + '/main.min.js'),
            loadStyle(this, FULLCALENDAR + '/main.min.css')
        ])
        .then(() => {
            this.initializeCalendar();
        })
        .catch(error => {
            console.error('Error loading FullCalendar', error);
        });
    }

    @wire(getTimeEntries)
    wiredTimeEntries({ error, data }) {
        if (data) {
            this.timeEntries = data;
            if (this.calendar) {
                this.calendar.removeAllEvents();
                this.calendar.addEventSource(this.formatEvents(data));
            }
        } else if (error) {
            console.error('Error fetching time entries', error);
        }
    }

    initializeCalendar() {
        const calendarEl = this.template.querySelector('.calendar');
        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            editable: true,
            events: this.formatEvents(this.timeEntries),
            eventDrop: this.handleEventDrop.bind(this)
        });
        this.calendar.render();
    }

    formatEvents(entries) {
        return entries.map(entry => ({
            id: entry.Id,
            title: entry.Description__c,
            start: entry.Start_Time__c,
            end: entry.End_Time__c
        }));
    }

    handleEventDrop(info) {
        const event = info.event;
        updateTimeEntry({ entryId: event.id, newStartTime: event.start.toISOString(), newEndTime: event.end.toISOString() })
            .then(() => {
                console.log('Time entry updated successfully');
            })
            .catch(error => {
                console.error('Error updating time entry', error);
                info.revert();
            });
    }
}
