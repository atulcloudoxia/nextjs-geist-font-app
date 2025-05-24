public with sharing class AnalyticsController {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getProjectUtilization() {
        return [
            SELECT Project__c, SUM(Duration__c) totalDuration
            FROM Time_Entry__c
            GROUP BY Project__c
            ORDER BY totalDuration DESC
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getResourceUtilization() {
        return [
            SELECT OwnerId, SUM(Duration__c) totalDuration
            FROM Time_Entry__c
            GROUP BY OwnerId
            ORDER BY totalDuration DESC
        ];
    }
}
