'use strict'

const tap = require('tap')

const PatientsController = require('../../app/scripts/controllers/patients')

tap.test('.someFunction()', { autoend: true }, (t) => {
  t.test('should reset search results when navigating away from page', (t) => {
    // given
    const scope = {
      $watch: () => {},
      $on: (event, callback) => {
        if (event === '$destroy') {
          callback()
        }
      }
    }
    const stateMock = {
      setSearchResults: (value) => {
        // then
        t.equals(value, null)
        t.end()
      }
    }
    // when
    PatientsController(scope, stateMock)
  })
})
