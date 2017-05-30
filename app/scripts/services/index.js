'use strict'

var app = require('angular').module('rcbsApp')

app.factory('Authinterceptor', require('./authinterceptor'))
app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('Authinterceptor')
})

app.factory('Api', require('./rest'))
app.factory('loadResource', require('./load-resource'))
