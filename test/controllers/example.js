'use strict'

const tap = require('tap')

const dashboardController = require('../../app/scripts/controllers/dashboard')

tap.test('.someFunction()', { autoend: true }, (t) => {
  t.test('should check something and pass', (t) => {
    // given
    const scope = { some: 'scope' }
    // when
    dashboardController(scope)
    // then
    t.equals(scope.some, 'scope')
    t.end()
  })
})
