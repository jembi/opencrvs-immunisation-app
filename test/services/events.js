'use strict'

const tap = require('tap')

const Events = require('../../app/scripts/services/events')
const encounterTemplate = require('../../app/scripts/services/FHIR/resources/Encounter')

tap.test('events .constructSimpleLinkageToCareObject should construct simple linkage to care object', (t) => {
  const events = Events()

  const encounter = JSON.parse(JSON.stringify(encounterTemplate))
  encounter.period.start = '2017-04-04'
  encounter.type[0].coding[0].display = 'ANC Visit'
  encounter.location[0].location.display = 'Chuk'
  const event = events.constructSimpleLinkageToCareObject(encounter)

  t.equals(event.eventType, 'linkage-to-care')
  t.equals(event.encounterDate, '2017-04-04')
  t.equals(event.encounterType, 'ANC Visit')
  t.equals(event.encounterLocation, 'Chuk')
  t.end()
})