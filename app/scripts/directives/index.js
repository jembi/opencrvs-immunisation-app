'use strict'

var app = require('angular').module('rcbsApp')

app.directive('dashboardHeader', [ 'Api', 'loadResource', require('./dashboard-header') ])
app.directive('searchById', require('./search-by-id'))
