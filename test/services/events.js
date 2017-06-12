'use strict'

const tap = require('tap')
const sinon = require('sinon')

const EventsService = require('../../app/scripts/services/events.js')()

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
// sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.constructSimpleHIVConfirmationObject()', { autoend: true }, (t) => {
  t.test('should construct a simple ofbject for HIV confirmation', (t) => {
    // given
    const Encounter = require('../resources/events/Encounter-HIV-Confirmation.json')
    const Observation = require('../resources/events/Observation-HIV-Confirmation.json')

    // when
    const hivConfimObj = EventsService.constructSimpleHIVConfirmationObject(Encounter, Observation)

    t.ok(hivConfimObj)

    t.equal(hivConfimObj.eventType, 'hiv-confirmation', 'should have a eventType of "hiv-confirmation"')
    t.equal(hivConfimObj.data.partnerStatus, 'Positive', 'should have a data.partnerStatus of "Positive"')
    t.equal(hivConfimObj.data.firstPositiveHivTestLocation, 'Chuk', 'should have a data.firstPositiveHivTestLocation of "Chuk"')
    t.equal(hivConfimObj.data.firstPositiveHivTestDate, '2010-06-30', 'should have a data.firstPositiveHivTestDate of "2010-06-30"')

    t.end()
  })
})
