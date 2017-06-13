'use strict'

const tap = require('tap')
const sinon = require('sinon')

const EventsService = require('../../app/scripts/services/events.js')()
const encounterTemplate = require('../../app/scripts/services/FHIR/resources/Encounter')
const observationTemplate = require('../../app/scripts/services/FHIR/resources/Observation')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
// sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.constructSimpleHIVConfirmationObject()', { autoend: true }, (t) => {
  t.test('should construct a simple object for HIV confirmation', (t) => {
    // given
    const encounter = JSON.parse(JSON.stringify(encounterTemplate))
    const observation = JSON.parse(JSON.stringify(observationTemplate))
    const observationPartner = JSON.parse(JSON.stringify(observationTemplate))

    encounter.period.start = '2017-06-01'
    encounter.type[0].coding[0].code = 'hiv-confirmation'
    encounter.type[0].coding[0].display = 'HIV Confirmation'
    encounter.location[0].location.display = 'Chuk'

    observation.effectiveDateTime = '2010-06-30'
    observation.code.coding[0].system = 'http://loinc.org'
    observation.code.coding[0].code = '33660-2'
    observation.code.coding[0].display = 'HIV 1 p24 Ag [Presence] in Serum by Neutralization test'
    observation.valueCodeableConcept = {
      coding: {
        system: 'http://loinc.org',
        code: 'LA6576-8'
      },
      text: 'Positive'
    }

    observationPartner.effectiveDateTime = '2010-06-30'
    observationPartner.code.coding[0].system = 'http://hearth.org/cbs'
    observationPartner.code.coding[0].code = 'partner-hiv-status'
    observationPartner.code.coding[0].display = 'Partners HIV status'
    observationPartner.valueCodeableConcept = {
      coding: {
        system: 'http://loinc.org',
        code: 'LA6576-8'
      },
      text: 'Positive'
    }

    // when
    const hivConfimObj = EventsService.constructSimpleHIVConfirmationObject(encounter, [observation, observationPartner])

    t.ok(hivConfimObj)

    t.equal(hivConfimObj.eventType, 'hiv-confirmation', 'should have a eventType of "hiv-confirmation"')
    t.equal(hivConfimObj.eventDate, '2017-06-01', 'should have a eventDate of "2017-06-01"')
    t.equal(hivConfimObj.data.partnerStatus, 'Positive', 'should have a data.partnerStatus of "Positive"')
    t.equal(hivConfimObj.data.firstPositiveHivTestLocation, 'Chuk', 'should have a data.firstPositiveHivTestLocation of "Chuk"')
    t.equal(hivConfimObj.data.firstPositiveHivTestDate, '2010-06-30', 'should have a data.firstPositiveHivTestDate of "2010-06-30"')

    t.end()
  })
})

tap.test('.constructSimpleFirstViralLoadObject()', { autoend: true }, (t) => {
  t.test('should construct a simple object for First Viral Load', (t) => {
    // given
    const encounter = JSON.parse(JSON.stringify(encounterTemplate))
    const observation = JSON.parse(JSON.stringify(observationTemplate))

    encounter.period.start = '2017-04-04'
    encounter.type[0].coding[0].code = 'first-viral-load'
    encounter.type[0].coding[0].display = 'First Viral Load'
    encounter.location[0].location.display = 'Chuk'

    observation.effectiveDateTime = '2017-04-04'
    observation.code.coding[0].system = 'http://loinc.org'
    observation.code.coding[0].code = '25836-8'
    observation.code.coding[0].display = 'HIV 1 RNA [#/​volume] (viral load) in Unspecified specimen by Probe and target amplification method'

    observation.valueQuantity = {
      value: 599,
      unit: 'copies/mL',
      system: 'http://unitsofmeasure.org',
      code: 'copies/mL'
    }

    observation.contained = [
      {
        resourceType: 'Practitioner',
        id: 'practioner-1',
        'name': [{
          'family': ['Smith'],
          'given': ['Jane']
        }]
      }
    ]

    observation.performer = [
      {
        reference: '#practioner-1'
      }
    ]

    // when
    const highViralLoadObj = EventsService.constructSimpleFirstViralLoadObject(encounter, [observation])

    t.ok(highViralLoadObj)

    t.equal(highViralLoadObj.eventType, 'first-viral-load', 'should have a eventType of "first-viral-load"')
    t.equal(highViralLoadObj.eventDate, '2017-04-04', 'should have a eventDate of "2017-04-04"')
    t.equal(highViralLoadObj.data.firstViralLoadDate, '2017-04-04', 'should have a data.firstViralLoadDate of "2017-04-04"')
    t.deepEquals(highViralLoadObj.data.firstViralLoadResults, observation.valueQuantity, 'should have a data.firstViralLoadResults object with results')
    t.equal(highViralLoadObj.data.firstViralLoadLocation, 'Chuk', 'should have a data.firstViralLoadLocation of "Chuk"')
    t.equal(highViralLoadObj.data.firstViralLoadProvider, 'Jane Smith', 'should have a data.firstViralLoadProvider of "Jane Smith"')

    t.end()
  })
})
