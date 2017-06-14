'use strict'

const tap = require('tap')

const displayEventData = require('../../app/scripts/directives/display-event-data')

tap.test('Display event dtaa directive', { autoend: true }, (t) => {
  t.test('should set url depending on eventType', (t) => {
    const scope = { event: { eventType: 'TestType' } }
    const directive = displayEventData()
    directive.link(scope)

    t.equals(scope.url, 'app/scripts/directives/display-event-data/TestType.html')
    t.end()
  })
})
