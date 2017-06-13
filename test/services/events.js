'use strict'

const tap = require('tap')

const Events = require('../../app/scripts/services/events')
const encounterTemplate = require('../../app/scripts/services/FHIR/resources/Encounter')
const observationTemplate = require('../../app/scripts/services/FHIR/resources/Observation')

tap.test('events .constructSimpleLinkageToCareObject should construct simple linkage to care object', (t) => {
  const events = Events()

  const encounter = JSON.parse(JSON.stringify(encounterTemplate))
  encounter.period.start = '2017-04-04'
  encounter.type[0].coding[0].display = 'ANC Visit'
  encounter.location[0].location.display = 'Chuk'

  const observation = JSON.parse(JSON.stringify(observationTemplate))
  observation.effectiveDateTime = '2017-05-05'
  observation.valueQuantity = 'Test Result'
  observation.performer[0].reference = '#practioner-1'
  observation.contained = [{
    resourceType: 'Practitioner',
    id: 'practioner-1',
    name: [{
      family: ['Provider'],
      given: ['Test']
    }]
  }]

  encounter._observations = [observation]
  const event = events.constructSimpleCD4CountObject(encounter)

  t.equals(event.eventType, 'cd4-count')
  t.equals(event.eventDate, '2017-04-04')
  t.equals(event.data.cd4CountDate, '2017-05-05')
  t.equals(event.data.cd4CountLocation, 'Chuk')
  t.equals(event.data.cd4CountResult, 'Test Result')
  t.equals(event.data.cd4CountProvider, 'Test Provider')
  t.end()
})
