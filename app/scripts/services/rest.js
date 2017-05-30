'use strict'

module.exports = function ($resource, config) {
  var protocol = config.protocol
  var host = config.host
  var port = config.port
  var server = protocol + '://' + host + ':' + port

  return {
    Patients: $resource(server + '/fhir/Patient')
  }
}
