public with sharing class TimeEntryController {
    @AuraEnabled(cacheable=true)
    public static List<Time_Entry__c> getTimeEntries() {
        return [SELECT Id, Start_Time__c, End_Time__c, Duration__c, Description__c FROM Time_Entry__c ORDER BY Start_Time__c DESC];
    }

    @AuraEnabled
    public static Time_Entry__c createTimeEntry(DateTime startTime, DateTime endTime, String description) {
        Time_Entry__c entry = new Time_Entry__c();
        entry.Start_Time__c = startTime;
        entry.End_Time__c = endTime;
        entry.Duration__c = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // duration in minutes
        entry.Description__c = description;
        insert entry;
        return entry;
    }

    @AuraEnabled
    public static void deleteTimeEntry(Id entryId) {
        delete [SELECT Id FROM Time_Entry__c WHERE Id = :entryId];
    }

    @AuraEnabled
    public static void updateTimeEntry(Id entryId, DateTime newStartTime, DateTime newEndTime) {
        Time_Entry__c entry = [SELECT Id, Start_Time__c, End_Time__c FROM Time_Entry__c WHERE Id = :entryId LIMIT 1];
        entry.Start_Time__c = newStartTime;
        entry.End_Time__c = newEndTime;
        entry.Duration__c = (newEndTime.getTime() - newStartTime.getTime()) / (1000 * 60);
        update entry;
    }
}
