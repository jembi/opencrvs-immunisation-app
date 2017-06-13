'use strict'

const tap = require('tap')

const dashboardController = require('../../app/scripts/controllers/dashboard')

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
    dashboardController(scope, stateMock)
  })
})
