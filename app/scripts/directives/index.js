'use strict'

var app = require('angular').module('rcbsApp')

app.directive('dashboardHeader', require('./dashboard-header'))
app.directive('patientsList', require('./patients-list'))
