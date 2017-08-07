'use strict'

var app = require('angular').module('opencrvsApp')

app.directive('header', require('./header'))
app.directive('patientsList', require('./patients-list'))
app.directive('patientsListRowDetails', require('./patients-list-row-details'))
app.directive('searchById', require('./search-by-id'))
app.directive('searchByDemographics', require('./search-by-demographics'))
app.directive('addPatientForm', require('./add-patient-form'))
app.directive('eventSelector', require('./add-events/event-selector'))
app.directive('addEvent', require('./add-events/add-event'))
app.directive('displayEventData', require('./display-event-data'))
