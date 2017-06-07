'use strict'

var app = require('angular').module('rcbsApp')

app.controller('DashboardControl', require('./dashboard'))
app.controller('AddPatientControl', require('./add-patient'))
app.controller('AddCbsEventsControl', require('./add-cbs-events'))
