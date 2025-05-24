public with sharing class BudgetController {
    @AuraEnabled(cacheable=true)
    public static List<Project_Budget__c> getBudgets() {
        return [SELECT Id, Project_Name__c, Budget_Amount__c, Spent_Amount__c FROM Project_Budget__c ORDER BY Project_Name__c];
    }

    @AuraEnabled
    public static Project_Budget__c createOrUpdateBudget(String projectName, Decimal budgetAmount, Decimal spentAmount) {
        Project_Budget__c budget = [SELECT Id FROM Project_Budget__c WHERE Project_Name__c = :projectName LIMIT 1];
        if (budget == null) {
            budget = new Project_Budget__c();
            budget.Project_Name__c = projectName;
        }
        budget.Budget_Amount__c = budgetAmount;
        budget.Spent_Amount__c = spentAmount;
        upsert budget;
        return budget;
    }
}
