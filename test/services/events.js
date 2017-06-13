'use strict'

const sinon = require('sinon')
const tap = require('tap')

const Events = require('../../app/scripts/services/events')
const encounterTemplate = require('../../app/scripts/services/FHIR/resources/Encounter')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('Events service', { autoend: true }, (t) => {
  t.test('.isEventOfType', { autoend: true }, (t) => {
    t.test('should return true when event is an HIV confirmation event', (t) => {
      const result = Events().isEventOfType('hiv-confirmation', require('../resources/events/hiv-confirmation.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an HIV confirmation event', (t) => {
      const result = Events().isEventOfType('hiv-confirmation', require('../resources/events/cd4-count.json'))
      t.false(result)
      t.end()
    })

    t.test('should return true when event is an Linkage to Care event', (t) => {
      const result = Events().isEventOfType('linkage-to-care', require('../resources/events/linkage-to-care.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an Linkage to Care event', (t) => {
      const result = Events().isEventOfType('linkage-to-care', require('../resources/events/viral-load.json'))
      t.false(result)
      t.end()
    })

    t.test('should return true when event is an CD4 count event', (t) => {
      const result = Events().isEventOfType('cd4-count', require('../resources/events/cd4-count.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an CD4 count event', (t) => {
      const result = Events().isEventOfType('cd4-count', require('../resources/events/viral-load.json'))
      t.false(result)
      t.end()
    })

    t.test('should return true when event is an Viral Load event', (t) => {
      const result = Events().isEventOfType('viral-load', require('../resources/events/viral-load.json'))
      t.true(result)
      t.end()
    })

    t.test('should return false when event isn\'t an Viral Load event', (t) => {
      const result = Events().isEventOfType('viral-load', require('../resources/events/hiv-confirmation.json'))
      t.false(result)
      t.end()
    })
  })

  t.test('.constructSimpleHIVConfirmationObject()', { autoend: true }, (t) => {
    t.test('should construct a simple ofbject for HIV confirmation', (t) => {
      // given
      const Encounter = require('../resources/events/Encounter-HIV-Confirmation.json')
      const Observation = require('../resources/events/Observation-HIV-Confirmation.json')
      const ObservationPartner = require('../resources/events/Observation-HIV-Confirmation-partner.json')
      const Observations = [Observation, ObservationPartner]

      // when
      const hivConfimObj = Events().constructSimpleHIVConfirmationObject(Encounter, Observations)

      t.ok(hivConfimObj)

      t.equal(hivConfimObj.eventType, 'hiv-confirmation', 'should have a eventType of "hiv-confirmation"')
      t.equal(hivConfimObj.eventDate, '2017-06-01', 'should have a eventDate of "2017-06-01"')
      t.equal(hivConfimObj.data.partnerStatus, 'Positive', 'should have a data.partnerStatus of "Positive"')
      t.equal(hivConfimObj.data.firstPositiveHivTestLocation, 'Chuk', 'should have a data.firstPositiveHivTestLocation of "Chuk"')
      t.equal(hivConfimObj.data.firstPositiveHivTestDate, '2010-06-30', 'should have a data.firstPositiveHivTestDate of "2010-06-30"')

      t.end()
    })
  })

  t.test('.formatEvents', { autoend: true }, (t) => {
    t.test('should delegate event formatting depending on event type')
  })

  t.test('.constructSimpleLinkageToCareObject', { autoend: true }, (t) => {
    t.test('should construct simple linkage to care object', (t) => {
      const events = Events()

      const encounter = JSON.parse(JSON.stringify(encounterTemplate))
      encounter.period.start = '2017-04-04'
      encounter.type[0].coding[0].display = 'ANC Visit'
      encounter.location[0].location.display = 'Chuk'
      const event = events.constructSimpleLinkageToCareObject(encounter)

      t.equals(event.eventType, 'linkage-to-care')
      t.equals(event.eventDate, '2017-04-04')
      t.equals(event.data.encounterType, 'ANC Visit')
      t.equals(event.data.encounterLocation, 'Chuk')
      t.end()
    })
  })
})
