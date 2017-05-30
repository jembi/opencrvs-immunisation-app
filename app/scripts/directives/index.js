'use strict'

var app = require('angular').module('rcbsApp')

app.directive('dashboardHeader', require('./dashboard-header'))
app.directive('searchById', require('./search-by-id'))
app.directive('searchByDemographics', require('./search-by-demographics'))
