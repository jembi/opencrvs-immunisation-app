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
const app = angular.module('rcbsApp', dependencies)

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
    templateUrl: 'app/views/add-cbs-events.html',
    controller: 'AddCbsEventsControl'
  })
  .when('/events/:patientId', {
    templateUrl: 'app/views/view-cbs-events.html',
    controller: 'ViewCbsEventsControl'
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
  // green
  $mdThemingProvider.definePalette('customPrimary', {
    '50': 'e0f3f2',
    '100': 'b3e1de',
    '200': '80cdc8',
    '300': '4db8b1',
    '400': '26a9a1',
    '500': '009a90',
    '600': '009288',
    '700': '00887d',
    '800': '007e73',
    '900': '006c61',
    'A100': '9cfff2',
    'A200': '69ffec',
    'A400': '36ffe5',
    'A700': '1cffe2',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': [ ],
    'contrastLightColors': [ '900' ]
  })

  // orange
  $mdThemingProvider.definePalette('customAccent', {
    '50': 'fef0e8',
    '100': 'fdd9c5',
    '200': 'fcc09e',
    '300': 'fba777',
    '400': 'fa9459',
    '500': 'f9813c',
    '600': 'f87936',
    '700': 'f76e2e',
    '800': 'f66427',
    '900': 'f5511a',
    'A100': 'ffffff',
    'A200': 'fff6f4',
    'A400': 'ffcfc1',
    'A700': 'ffbba7',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': [ ],
    'contrastLightColors': [ '900' ]
  })

  $mdThemingProvider.theme('default')
    .primaryPalette('customPrimary', {
      'default': '400',
      'hue-1': '100',
      'hue-2': '600',
      'hue-3': 'A100'
    })
    .accentPalette('customAccent', {
      'default': '800',
      'hue-1': '100',
      'hue-2': '600',
      'hue-3': 'A100'
    })
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
    angular.bootstrap(document, ['rcbsApp'])
  })
}

loadConfig().then(bootstrapApplication)
