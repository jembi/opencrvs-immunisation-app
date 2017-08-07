'use strict'

var app = require('angular').module('rcbsApp')

app.directive('header', require('./header'))
app.directive('patientsList', require('./patients-list'))
app.directive('patientsListRowDetails', require('./patients-list-row-details'))
app.directive('searchById', require('./search-by-id'))
app.directive('searchByDemographics', require('./search-by-demographics'))
app.directive('addPatientForm', require('./add-patient-form'))
app.directive('cbsEventSelector', require('./add-events/event-selector'))
app.directive('addCbsEvent', require('./add-events/add-event'))
app.directive('displayEventData', require('./display-event-data'))
