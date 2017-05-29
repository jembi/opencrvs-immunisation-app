'use strict'

var app = require('angular').module('rcbsApp')

app.controller('DashboardControl', require('./dashboard'))

// partial controllers
app.controller('SearchByDemographics', require('./partials/search-by-demographics'))
