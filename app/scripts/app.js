'use strict'

var angular = require('angular')
var ngRoute = require('angular-route')
var formBuilder = require('md-form-builder')
var ngMaterial = require('angular-material')
var ngCookies = require('angular-cookies')
var ngResource = require('angular-resource')
var ngMessages = require('angular-messages')

var dependencies = [ ngRoute, formBuilder, ngMaterial, ngCookies, ngResource, ngMessages ]
var app = angular.module('rcbsApp', dependencies)

require('./controllers')
require('./directives')
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

app.config(function ($locationProvider) {
  $locationProvider.hashPrefix('') // Remove ! from url
})

function bootstrapApplication () {
  angular.element(document).ready(function () {
    angular.bootstrap(document, ['rcbsApp'])
  })
}

bootstrapApplication()
