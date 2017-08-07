'use strict'

var app = require('angular').module('opencrvsApp')

app.controller('PatientsControl', require('./patients'))
app.controller('AddPatientControl', require('./add-patient'))
app.controller('addEventsControl', require('./add-events'))
app.controller('VieweventsControl', require('./view-events'))
app.controller('UpdatePatientControl', require('./update-patient'))
