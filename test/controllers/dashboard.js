'use strict'

const tap = require('tap')
var sinon = require('sinon')

const dashboardController = require('../../app/scripts/controllers/dashboard')

tap.test('.someFunction()', { autoend: true }, (t) => {
  t.test('should check something and pass', (t) => {
    // given
    const scope = {
      some: 'scope',
      $watch: () => {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
    }
    const patientsResults = {
      'resourceType': 'Bundle',
      'id': 'c3a312d0-4456-11e7-9cc5-dd24d9f4c890',
      'meta': {
        'lastUpdated': '2017-05-29T12:08:29.821+02:00'
      },
      'type': 'searchset',
      'total': 0,
      'link': [
        {
          'relation': 'self',
          'url': 'http://localhost:3447/fhir/Patient'
        }
      ],
      'entry': []
    }
    const Api = {
      Patients: {
        get: sinon.stub().callsArgWith(1, patientsResults).returns({ $promise: new Promise(function (resolve) {
          resolve()
        })})
      }
    }
    // when
    dashboardController(scope, Api)
    // then
    t.equals(scope.some, 'scope')
    t.end()
  })
})
