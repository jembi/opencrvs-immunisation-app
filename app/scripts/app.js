'use strict'

const moment = require('moment')
const angular = require('angular')
const ngRoute = require('angular-route')
const ngCookies = require('angular-cookies')
const ngResource = require('angular-resource')
const ngMessages = require('angular-messages')
const ngMaterial = require('angular-material')
const mdDataTable = require('angular-material-data-table')
const formBuilder = require('md-form-builder')

require('angular-timeline')

const dependencies = [ ngRoute, formBuilder, ngMaterial, ngCookies, ngResource, ngMessages, mdDataTable, 'angular-timeline' ]
const app = angular.module('ocrvsApp', dependencies)

app.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'app/views/landing.html'
  })
  .when('/patients', {
    templateUrl: 'app/views/patients.html',
    controller: 'PatientsControl'
  })
  .when('/add-patient', {
    templateUrl: 'app/views/add-patient.html',
    controller: 'AddPatientControl'
  })
  .when('/patients/:patientId/add-events', {
    templateUrl: 'app/views/add-events.html',
    controller: 'addEventsControl'
  })
  .when('/events/:patientId', {
    templateUrl: 'app/views/view-events.html',
    controller: 'VieweventsControl'
  })
  .when('/update-patient/:patientId', {
    templateUrl: 'app/views/update-patient.html',
    controller: 'UpdatePatientControl'
  })
  .otherwise({
    redirectTo: '/'
  })
})

app.config(function ($locationProvider) {
  $locationProvider.hashPrefix('') // Remove ! from url
})

/* ------------- CUSTOM THEMING ---------------- */
app.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue')
    .accentPalette('orange')
})

app.config(function ($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function (date) {
    return date ? moment(date).format('YYYY-MM-DD') : date
  }
})

function loadConfig () {
  var initInjector = angular.injector(['ng'])
  var $http = initInjector.get('$http')

  return $http.get('app/config/default.json').then(function (response) {
    app.constant('config', response.data)
  }, function (err) {
    app.constant('config', 'No Config Loaded')
    console.error(err)
  })
}

function bootstrapApplication () {
  require('./directives')
  require('./services')
  require('./controllers')

  angular.element(document).ready(function () {
    angular.bootstrap(document, ['ocrvsApp'])
  })
}

loadConfig().then(bootstrapApplication)
