'use strict'

module.exports = function ($resource) {
  var server = 'http://localhost:3447'

  return {
    Patients: $resource(server + '/fhir/Patient', {}, {
      match: { method: 'POST', url: server + '/fhir/Patient/$match' }
    })
  }
}
