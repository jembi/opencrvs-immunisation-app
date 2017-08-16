'use strict'

module.exports = function ($resource, config) {
  var protocol = config.protocol
  var host = config.host
  var port = config.port
  var server = protocol + '://' + host + ':' + port

  return {
    Patients: $resource(server + '/fhir/Patient/:id', { id: '@id' }, {
      match: { method: 'POST', url: server + '/fhir/Patient/$match' },
      update: { method: 'PUT' }
    }),

    FhirRoot: $resource(server + '/fhir'),

    Encounters: $resource(server + '/fhir/Encounter'),

    Observations: $resource(server + '/fhir/Observation'),

    Binary: $resource(server + '/fhir/Binary'),

    Composition: $resource(server + '/fhir/Composition'),

    DocumentManifest: $resource(server + '/fhir/DocumentManifest'),

    DocumentReference: $resource(server + '/fhir/DocumentReference'),

    Reference: $resource(server + '/fhir/:resource/:id', { resource: '@resource', id: '@id' }),

    Locations: $resource(server + '/fhir/Location')
  }
}
