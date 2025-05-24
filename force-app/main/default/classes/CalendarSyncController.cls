public with sharing class CalendarSyncController {
    @AuraEnabled(cacheable=true)
    public static List<Google_Calendar_Event__c> getCalendarEvents() {
        return [SELECT Id, Event_Start__c, Event_End__c, Subject__c, Description__c FROM Google_Calendar_Event__c ORDER BY Event_Start__c DESC];
    }

    @AuraEnabled
    public static void syncCalendarEvents() {
        // Example implementation of Google Calendar sync using HTTP callout
        // Note: This requires Named Credential setup in Salesforce for Google OAuth

        String namedCredential = 'Google_Calendar_Named_Credential'; // Replace with your Named Credential API name
        String calendarId = 'primary'; // Use 'primary' or specific calendar ID
        String endpoint = 'callout:' + namedCredential + '/calendar/v3/calendars/' + calendarId + '/events';

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpoint);
        request.setMethod('GET');
        request.setHeader('Content-Type', 'application/json');

        try {
            HttpResponse response = http.send(request);
            if (response.getStatusCode() == 200) {
                Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                List<Object> items = (List<Object>) result.get('items');

                List<Google_Calendar_Event__c> eventsToUpsert = new List<Google_Calendar_Event__c>();

                for (Object itemObj : items) {
                    Map<String, Object> item = (Map<String, Object>) itemObj;
                    String eventId = (String) item.get('id');
                    Map<String, Object> start = (Map<String, Object>) item.get('start');
                    Map<String, Object> end = (Map<String, Object>) item.get('end');
                    String summary = (String) item.get('summary');
                    String description = (String) item.get('description');

                    DateTime eventStart = start.containsKey('dateTime') ? DateTime.valueOf((String) start.get('dateTime')) : DateTime.valueOf((String) start.get('date'));
                    DateTime eventEnd = end.containsKey('dateTime') ? DateTime.valueOf((String) end.get('dateTime')) : DateTime.valueOf((String) end.get('date'));

                    Google_Calendar_Event__c eventRecord = new Google_Calendar_Event__c();
                    eventRecord.Google_Event_Id__c = eventId;
                    eventRecord.Subject__c = summary;
                    eventRecord.Description__c = description;
                    eventRecord.Event_Start__c = eventStart;
                    eventRecord.Event_End__c = eventEnd;

                    eventsToUpsert.add(eventRecord);
                }

                if (!eventsToUpsert.isEmpty()) {
                    upsert eventsToUpsert Google_Event_Id__c;
                }
            } else {
                System.debug('Failed to fetch Google Calendar events. Status: ' + response.getStatus());
            }
        } catch (Exception e) {
            System.debug('Exception during Google Calendar sync: ' + e.getMessage());
        }
    }
}
