'use strict'

const tap = require('tap')

const eventService = require('../../app/scripts/services/events')()

tap.test('Events service', { autoend: true }, (t) => {
  t.test('.isHIVConfirmation', { autoend: true }, (t) => {
    t.test('should return true when event is an HIV confirmation event', (t) => {
      const result = eventService.isHIVConfirmation(require('../resources/events/hiv-confirmation.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an HIV confirmation event', (t) => {
      const result = eventService.isHIVConfirmation(require('../resources/events/cd4-count.json'))
      t.false(result)
      t.end()
    })
  })

  t.test('.isLinkageToCare', { autoend: true }, (t) => {
    t.test('should return true when event is an Linkage to Care event', (t) => {
      const result = eventService.isLinkageToCare(require('../resources/events/linkage-to-care.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an Linkage to Care event', (t) => {
      const result = eventService.isLinkageToCare(require('../resources/events/viral-load.json'))
      t.false(result)
      t.end()
    })
  })

  t.test('.isCD4Count', { autoend: true }, (t) => {
    t.test('should return true when event is an CD4 count event', (t) => {
      const result = eventService.isCD4Count(require('../resources/events/cd4-count.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an CD4 count event', (t) => {
      const result = eventService.isCD4Count(require('../resources/events/viral-load.json'))
      t.false(result)
      t.end()
    })
  })

  t.test('.isViralLoad', { autoend: true }, (t) => {
    t.test('should return true when event is an Viral Load event', (t) => {
      const result = eventService.isViralLoad(require('../resources/events/viral-load.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an Viral Load event', (t) => {
      const result = eventService.isViralLoad(require('../resources/events/hiv-confirmation.json'))
      t.false(result)
      t.end()
    })
  })

  t.test('.formatEvents', { autoend: true }, (t) => {
    t.test('should delegate event formatting depending on event type')
  })
})
