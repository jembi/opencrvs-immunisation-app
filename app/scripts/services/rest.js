'use strict'

module.exports = function ($resource) {

  var server = 'http://localhost:3447'

  return {

    HearthBeat: $resource( server + '/api/heartbeat'),
    Patients: $resource( server + '/fhir/Patient' )

  }
}
