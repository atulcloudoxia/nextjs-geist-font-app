import { LightningElement, track, wire } from 'lwc';
import getBudgets from '@salesforce/apex/BudgetController.getBudgets';

export default class BudgetManager extends LightningElement {
    @track budgets = [];

    @wire(getBudgets)
    wiredBudgets({ error, data }) {
        if (data) {
            this.budgets = data;
        } else if (error) {
            this.budgets = [];
            console.error('Error fetching budgets', error);
        }
    }
}
