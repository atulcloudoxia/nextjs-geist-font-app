import { LightningElement, track, wire } from 'lwc';
import getProjectUtilization from '@salesforce/apex/AnalyticsController.getProjectUtilization';
import getResourceUtilization from '@salesforce/apex/AnalyticsController.getResourceUtilization';

export default class AnalyticsDashboard extends LightningElement {
    @track projectUtilization = [];
    @track resourceUtilization = [];

    @wire(getProjectUtilization)
    wiredProjectUtilization({ error, data }) {
        if (data) {
            this.projectUtilization = data;
        } else if (error) {
            this.projectUtilization = [];
            console.error('Error fetching project utilization', error);
        }
    }

    @wire(getResourceUtilization)
    wiredResourceUtilization({ error, data }) {
        if (data) {
            this.resourceUtilization = data;
        } else if (error) {
            this.resourceUtilization = [];
            console.error('Error fetching resource utilization', error);
        }
    }
}
