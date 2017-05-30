'use strict'

var app = require('angular').module('rcbsApp')

app.factory('Api', require('./rest'))
app.factory('loadResource', require('./load-resource'))
