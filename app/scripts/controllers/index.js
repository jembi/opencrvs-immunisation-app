'use strict'

var app = require('angular').module('rcbsApp')

app.controller('PatientsControl', require('./patients'))
app.controller('AddPatientControl', require('./add-patient'))
app.controller('AddCbsEventsControl', require('./add-events'))
app.controller('ViewCbsEventsControl', require('./view-events'))
app.controller('UpdatePatientControl', require('./update-patient'))
