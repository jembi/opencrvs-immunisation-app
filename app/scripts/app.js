'use strict'

var angular = require('angular')
var ngRoute = require('angular-route')
var ngResource = require('angular-resource')

var dependencies = [ ngRoute, ngResource ]
var app = angular.module('rcbsApp', dependencies)

require('./services')
require('./controllers')

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

app.config(function ($locationProvider) {
  $locationProvider.hashPrefix('') // Remove ! from url
})
