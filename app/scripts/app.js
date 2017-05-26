'use strict'

var angular = require('angular')
var ngRoute = require('angular-route')

var dependencies = [ ngRoute ]
var app = angular.module('rcbsApp', dependencies)

require('./controllers')
require('./services')

app.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/dashboard.html',
    controller: 'DashboardControl'
  })
  .otherwise({
    redirectTo: '/'
  })
})
