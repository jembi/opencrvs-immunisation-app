'use strict'

var app = require('angular').module('rcbsApp')

app.directive('dashboardHeader', require('./dashboard-header'))
app.directive('searchById', require('./search-by-id'))
app.directive('searchByDemographics', require('./search-by-demographics'))
app.directive('patientDetailsBar', require('./add-cbs-events/patient-details-bar'))
app.directive('cbsEventSelector', require('./add-cbs-events/cbs-event-selector'))
app.directive('linkageToCare', require('./add-cbs-events/linkage-to-care'))
