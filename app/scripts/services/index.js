'use strict'

var app = require('angular').module('rcbsApp')

app.factory('Authinterceptor', require('./authinterceptor'))
app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('Authinterceptor')
})

app.factory('Api', require('./rest'))
app.factory('loadResource', require('./load-resource'))
app.factory('state', require('./state'))
app.factory('FHIR', require('./FHIR/FHIR'))
app.factory('FormBuilderService', require('./FormBuilder'))
app.factory('events', require('./events'))
