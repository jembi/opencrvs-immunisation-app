'use strict'

const tap = require('tap')

const eventService = require('../../app/scripts/services/events')()

tap.test('Events service', { autoend: true }, (t) => {
  t.test('.isEventOfType', { autoend: true }, (t) => {
    t.test('should return true when event is an HIV confirmation event', (t) => {
      const result = eventService.isEventOfType('hiv-confirmation', require('../resources/events/hiv-confirmation.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an HIV confirmation event', (t) => {
      const result = eventService.isEventOfType('hiv-confirmation', require('../resources/events/cd4-count.json'))
      t.false(result)
      t.end()
    })

    t.test('should return true when event is an Linkage to Care event', (t) => {
      const result = eventService.isEventOfType('linkage-to-care', require('../resources/events/linkage-to-care.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an Linkage to Care event', (t) => {
      const result = eventService.isEventOfType('linkage-to-care', require('../resources/events/viral-load.json'))
      t.false(result)
      t.end()
    })

    t.test('should return true when event is an CD4 count event', (t) => {
      const result = eventService.isEventOfType('cd4-count', require('../resources/events/cd4-count.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an CD4 count event', (t) => {
      const result = eventService.isEventOfType('cd4-count', require('../resources/events/viral-load.json'))
      t.false(result)
      t.end()
    })

    t.test('should return true when event is an Viral Load event', (t) => {
      const result = eventService.isEventOfType('viral-load', require('../resources/events/viral-load.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an Viral Load event', (t) => {
      const result = eventService.isEventOfType('viral-load', require('../resources/events/hiv-confirmation.json'))
      t.false(result)
      t.end()
    })
  })

  t.test('.formatEvents', { autoend: true }, (t) => {
    t.test('should delegate event formatting depending on event type')
  })
})
