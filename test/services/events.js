'use strict'

const sinon = require('sinon')
const tap = require('tap')

const Events = require('../../app/scripts/services/events')
const encounterTemplate = require('../../app/scripts/services/FHIR/resources/Encounter')
const observationTemplate = require('../../app/scripts/services/FHIR/resources/Observation')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('Events service', { autoend: true }, (t) => {
  t.test('.sortEventsDesc', { autoend: true }, (t) => {
    t.test('should sort events in descending order', (t) => {
      const sortedDates = Events().sortEventsDesc([
        { expectedOrder: 4, eventDate: new Date('2017-01-13T11:11:59+02:00') },
        { expectedOrder: 0, eventDate: new Date('2017-06-13T11:11:59+02:00') },
        { expectedOrder: 3, eventDate: new Date('2017-03-13T11:11:59+02:00') },
        { expectedOrder: 1, eventDate: new Date('2017-04-14T11:11:59+02:00') },
        { expectedOrder: 2, eventDate: new Date('2017-04-13T11:11:59+02:00') }
      ])
      t.equals(sortedDates[0].expectedOrder, 0)
      t.equals(sortedDates[1].expectedOrder, 1)
      t.equals(sortedDates[2].expectedOrder, 2)
      t.equals(sortedDates[3].expectedOrder, 3)
      t.equals(sortedDates[4].expectedOrder, 4)
      t.end()
    })

    t.test('should work when dates are strings', (t) => {
      const sortedDates = Events().sortEventsDesc([
        { expectedOrder: 4, eventDate: new Date('2017-01-13T11:11:59+02:00') },
        { expectedOrder: 0, eventDate: '2017-06-13T11:11:59+02:00' },
        { expectedOrder: 3, eventDate: new Date('2017-03-13T11:11:59+02:00') },
        { expectedOrder: 1, eventDate: '2017-04-14T11:11:59+02:00' },
        { expectedOrder: 2, eventDate: '2017-04-13T11:11:59+02:00' }
      ])
      t.equals(sortedDates[0].expectedOrder, 0)
      t.equals(sortedDates[1].expectedOrder, 1)
      t.equals(sortedDates[2].expectedOrder, 2)
      t.equals(sortedDates[3].expectedOrder, 3)
      t.equals(sortedDates[4].expectedOrder, 4)
      t.end()
    })
  })

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
      const hivConfimObj = Events().constructSimpleHIVConfirmationObject(encounter, [observation, observationPartner])

      t.ok(hivConfimObj)

      t.equal(hivConfimObj.eventType, 'hiv-confirmation', 'should have a eventType of "hiv-confirmation"')
      t.equal(hivConfimObj.eventDate, '2017-06-01', 'should have a eventDate of "2017-06-01"')
      t.equal(hivConfimObj.data.partnerStatus, 'Positive', 'should have a data.partnerStatus of "Positive"')
      t.equal(hivConfimObj.data.firstPositiveHivTestLocation, 'Chuk', 'should have a data.firstPositiveHivTestLocation of "Chuk"')
      t.equal(hivConfimObj.data.firstPositiveHivTestDate, '2010-06-30', 'should have a data.firstPositiveHivTestDate of "2010-06-30"')

      t.end()
    })
  })

  t.test('.constructSimpleFirstViralLoadObject()', { autoend: true }, (t) => {
    t.test('should construct a simple object for First Viral Load', (t) => {
      // given
      const encounter = JSON.parse(JSON.stringify(encounterTemplate))
      const observation = JSON.parse(JSON.stringify(observationTemplate))

      encounter.period.start = '2017-04-04'
      encounter.type = [
        { coding: [ { system: 'http://hearth.org/cbs/event-types', code: 'viral-load', display: 'Viral Load' } ] }
      ]
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
      const highViralLoadObj = Events().constructSimpleFirstViralLoadObject(encounter, [observation])

      t.ok(highViralLoadObj)

      t.equal(highViralLoadObj.eventType, 'viral-load', 'should have a eventType of "viral-load"')
      t.equal(highViralLoadObj.eventDate, '2017-04-04', 'should have a eventDate of "2017-04-04"')
      t.equal(highViralLoadObj.data.viralLoadDate, '2017-04-04', 'should have a data.firstViralLoadDate of "2017-04-04"')
      t.deepEquals(highViralLoadObj.data.viralLoadResults, observation.valueQuantity, 'should have a data.firstViralLoadResults object with results')
      t.equal(highViralLoadObj.data.viralLoadLocation, 'Chuk', 'should have a data.firstViralLoadLocation of "Chuk"')
      t.equal(highViralLoadObj.data.viralLoadProvider, 'Jane Smith', 'should have a data.firstViralLoadProvider of "Jane Smith"')

      t.end()
    })
  })

  t.test('.formatEvents', { autoend: true }, (t) => {
    t.test('should delegate event formatting depending on event type', (t) => {
      // given
      // HIV Confirmation
      const hivConfirmationEncounter = JSON.parse(JSON.stringify(encounterTemplate))
      const hivConfirmationObservation = JSON.parse(JSON.stringify(observationTemplate))
      const hivConfirmationObservationPartnerStatus = JSON.parse(JSON.stringify(observationTemplate))
      hivConfirmationEncounter.period.start = '2017-06-01'
      hivConfirmationEncounter.type = [
        { coding: [ { system: 'http://hearth.org/cbs/event-types', code: 'hiv-confirmation', display: 'HIV Confirmation' } ] }
      ]
      hivConfirmationEncounter.type[0].coding[0].code = 'hiv-confirmation'
      hivConfirmationEncounter.type[0].coding[0].display = 'HIV Confirmation'
      hivConfirmationEncounter.location[0].location.display = 'Chuk'

      hivConfirmationObservation.effectiveDateTime = '2010-06-30'
      hivConfirmationObservation.code.coding[0].system = 'http://loinc.org'
      hivConfirmationObservation.code.coding[0].code = '33660-2'
      hivConfirmationObservation.code.coding[0].display = 'HIV 1 p24 Ag [Presence] in Serum by Neutralization test'
      hivConfirmationObservation.valueCodeableConcept = {
        coding: {
          system: 'http://loinc.org',
          code: 'LA6576-8'
        },
        text: 'Positive'
      }

      hivConfirmationObservationPartnerStatus.effectiveDateTime = '2010-06-30'
      hivConfirmationObservationPartnerStatus.code.coding[0].system = 'http://hearth.org/cbs'
      hivConfirmationObservationPartnerStatus.code.coding[0].code = 'partner-hiv-status'
      hivConfirmationObservationPartnerStatus.code.coding[0].display = 'Partners HIV status'
      hivConfirmationObservationPartnerStatus.valueCodeableConcept = {
        coding: {
          system: 'http://loinc.org',
          code: 'LA6576-8'
        },
        text: 'Positive'
      }

      // Linkage to Care
      const linkageToCareEncounter = JSON.parse(JSON.stringify(encounterTemplate))
      linkageToCareEncounter.period.start = '2017-04-04'
      linkageToCareEncounter.type = [
        { coding: [ { system: 'http://hearth.org/cbs/event-types', code: 'linkage-to-care', display: 'Linkage to Care' } ] },
        { coding: [ { system: 'http://hearth.org/cbs/encounter-types', code: 'anc-visit', display: 'ANC Visit' } ] }
      ]
      linkageToCareEncounter.location[0].location.display = 'Chuk'

      // CD4 Count
      const cd4CountEncounter = JSON.parse(JSON.stringify(encounterTemplate))
      const cd4CountObservation = JSON.parse(JSON.stringify(observationTemplate))
      cd4CountEncounter.period.start = '2017-04-04'
      cd4CountEncounter.type = [
        { coding: [ { system: 'http://hearth.org/cbs/event-types', code: 'cd4-count', display: 'CD4 Count' } ] }
      ]
      cd4CountEncounter.location[0].location.display = 'Chuk'
      cd4CountObservation.effectiveDateTime = '2017-05-05'
      cd4CountObservation.valueQuantity = 'Test Result'
      cd4CountObservation.performer[0].reference = '#practioner-1'
      cd4CountObservation.contained = [{
        resourceType: 'Practitioner',
        id: 'practioner-1',
        name: [{
          family: ['Provider'],
          given: ['Test']
        }]
      }]
    }]

      // Viral Load
      const viralLoadEncounter = JSON.parse(JSON.stringify(encounterTemplate))
      const viralLoadObservation = JSON.parse(JSON.stringify(observationTemplate))
      viralLoadEncounter.period.start = '2017-04-04'
      viralLoadEncounter.type = [
        { coding: [ { system: 'http://hearth.org/cbs/event-types', code: 'viral-load', display: 'First Viral Load' } ] }
      ]
      viralLoadEncounter.location[0].location.display = 'Chuk'

      viralLoadObservation.effectiveDateTime = '2017-04-04'
      viralLoadObservation.code.coding[0].system = 'http://loinc.org'
      viralLoadObservation.code.coding[0].code = '25836-8'
      viralLoadObservation.code.coding[0].display = 'HIV 1 RNA [#/​volume] (viral load) in Unspecified specimen by Probe and target amplification method'

      viralLoadObservation.valueQuantity = {
        value: 599,
        unit: 'copies/mL',
        system: 'http://unitsofmeasure.org',
        code: 'copies/mL'
      }
    ]

      viralLoadObservation.contained = [
        {
          resourceType: 'Practitioner',
          id: 'practioner-1',
          'name': [{
            'family': ['Smith'],
            'given': ['Jane']
          }]
        }
      ]

      viralLoadObservation.performer = [
        {
          reference: '#practioner-1'
        }
      ]

      const encounters = [
        {
          'resource': hivConfirmationEncounter,
          '_observations': [hivConfirmationObservation, hivConfirmationObservationPartnerStatus]
        }, {
          'resource': linkageToCareEncounter,
          '_observations': []
        }, {
          'resource': cd4CountEncounter,
          '_observations': [cd4CountObservation]
        }, {
          'resource': viralLoadEncounter,
          '_observations': [viralLoadObservation]
        }
      ]

      // when
      const formattedEvents = Events().formatEvents(encounters)

      t.ok(formattedEvents)

      t.equal(formattedEvents[0].eventType, 'hiv-confirmation', 'should have a eventType of "hiv-confirmation"')
      t.equal(formattedEvents[0].eventDate, '2017-06-01', 'should have a eventDate of "2017-06-01"')
      t.equal(formattedEvents[0].data.partnerStatus, 'Positive', 'should have a partnerStatus of "Positive"')
      t.equal(formattedEvents[0].data.firstPositiveHivTestLocation, 'Chuk', 'should have a firstPositiveHivTestLocation of "Chuk"')
      t.equal(formattedEvents[0].data.firstPositiveHivTestDate, '2010-06-30', 'should have a firstPositiveHivTestDate of "2010-06-30"')

      t.equal(formattedEvents[1].eventType, 'linkage-to-care', 'should have a eventType of "linkage-to-care"')
      t.equal(formattedEvents[1].eventDate, '2017-04-04', 'should have a eventDate of "2017-04-04"')
      t.equal(formattedEvents[1].data.encounterType, 'ANC Visit', 'should have a "encounterType" of "ANC Visit"')
      t.equal(formattedEvents[1].data.encounterLocation, 'Chuk', 'should have a encounterLocation of "Chuk"')

      t.equal(formattedEvents[2].eventType, 'cd4-count', 'should have a eventType of "cd4-count"')
      t.equal(formattedEvents[2].eventDate, '2017-04-04', 'should have a eventDate of "2017-04-04"')
      t.equal(formattedEvents[2].data.cd4CountDate, '2017-05-05', 'should have a cd4CountDate of "2017-05-05"')
      t.equal(formattedEvents[2].data.cd4CountLocation, 'Chuk', 'should have a cd4CountLocation of "Chuk"')
      t.equal(formattedEvents[2].data.cd4CountResult, 'Test Result', 'should have a cd4CountResult of "Test Result"')
      t.equal(formattedEvents[2].data.cd4CountProvider, 'Test Provider', 'should have a cd4CountProvider of "Test Provider"')

      t.equal(formattedEvents[3].eventType, 'viral-load', 'should have a eventType of "viral-load"')
      t.equal(formattedEvents[3].eventDate, '2017-04-04', 'should have a eventDate of "2017-04-04"')
      t.equal(formattedEvents[3].data.viralLoadDate, '2017-04-04', 'should have a firstViralLoadDate of "2017-04-04"')
      t.equal(formattedEvents[3].data.viralLoadResults.unit, 'copies/mL', 'should have a firstViralLoadResults.unit of "copies/mL"')
      t.equal(formattedEvents[3].data.viralLoadResults.value, 599, 'should have a firstViralLoadResults.value of "599"')
      t.equal(formattedEvents[3].data.viralLoadLocation, 'Chuk', 'should have a firstViralLoadLocation of "Chuk"')
      t.equal(formattedEvents[3].data.viralLoadProvider, 'Jane Smith', 'should have a firstViralLoadProvider of "Jane Smith"')

      t.end()
    })
  })

  t.test('.getAllEncountersForPatient', { autoend: true }, (t) => {
    t.test('fetch encounters and return array', (t) => {
      // Encounters for Patient/12345
      const encounter1 = JSON.parse(JSON.stringify(encounterTemplate))
      encounter1.id = '1'
      encounter1.period.start = '2017-01-01'
      encounter1.location[0].location.display = 'Test Hospital 1'
      encounter1.patient.reference = 'Patient/12345'
      encounter1.type[0].coding[0].code = 'linkage-to-care'
      const encounter2 = JSON.parse(JSON.stringify(encounterTemplate))
      encounter2.id = '2'
      encounter2.period.start = '2017-02-02'
      encounter2.location[0].location.display = 'Test Hospital 2'
      encounter2.patient.reference = 'Patient/12345'
      encounter2.type[0].coding[0].code = 'first-cd4-count'

      const encountersBundle = { entry: [encounter1, encounter2] }

      const apiMock = {
        Encounters: {
          get: (params) => {
            t.equals(params.patient, '12345')
            return new Promise((resolve, reject) => {
              resolve(encountersBundle)
            })
          }
        }
      }

      const events = Events(apiMock)
      events.getAllEncountersForPatient('12345', (err, res) => {
        t.error(err)

        t.equals(res[0].id, '1')
        t.equals(res[1].id, '2')
      })
      t.end()
    })
  })

  t.test('.addObservationsToEncounters', { autoend: true }, (t) => {
    t.test('attach observations to encounters and return array', (t) => {
      // Encounters for Patient/12345
      const encounter1 = JSON.parse(JSON.stringify(encounterTemplate))
      encounter1.id = '1'
      encounter1.period.start = '2017-01-01'
      encounter1.location[0].location.display = 'Test Hospital 1'
      encounter1.patient.reference = 'Patient/12345'
      encounter1.type[0].coding[0].code = 'linkage-to-care'
      const encounter2 = JSON.parse(JSON.stringify(encounterTemplate))
      encounter2.id = '2'
      encounter2.period.start = '2017-02-02'
      encounter2.location[0].location.display = 'Test Hospital 2'
      encounter2.patient.reference = 'Patient/12345'
      encounter2.type[0].coding[0].code = 'first-cd4-count'

      // Observations for Encounters 1 and 2
      const observation1 = JSON.parse(JSON.stringify(observationTemplate))
      observation1.encounter.reference = 'Encounter/1'
      observation1.valueCodeableConcept.coding = { system: 'Test System 1', code: 'Test Code 1' }
      observation1.valueCodeableConcept.text = 'Observation 1 outcome'
      const observation2 = JSON.parse(JSON.stringify(observationTemplate))
      observation2.encounter.reference = 'Encounter/1'
      observation2.valueCodeableConcept.coding = { system: 'Test System 2', code: 'Test Code 2' }
      observation2.valueCodeableConcept.text = 'Observation 2 outcome'
      const observation3 = JSON.parse(JSON.stringify(observationTemplate))
      observation3.encounter.reference = 'Encounter/2'
      observation3.valueCodeableConcept.coding = { system: 'Test System 3', code: 'Test Code 3' }
      observation3.valueCodeableConcept.text = 'Observation 3 outcome'

      const encounters = [encounter1, encounter2]

      const apiMock = {
        Observations: {
          get: (params) => {
            let observations
            switch (params['encounter.reference'].$eq) {
              case 'Encounter/1':
                observations = [observation1, observation2]
                break
              case 'Encounter/2':
                observations = [observation3]
                break
            }
            const result = {
              entry: observations,
              $promise: Promise.resolve(),
              $resolved: true
            }
            return result
          }
        }
      }
      const qMock = {
        defer: () => {
          return {
            resolve: (encountersArray) => {
              t.equals(encountersArray[0]._observations[0].encounter.reference, 'Encounter/1')
              t.equals(encountersArray[0]._observations[1].encounter.reference, 'Encounter/1')
              t.equals(encountersArray[1]._observations[0].encounter.reference, 'Encounter/2')
              t.end()
            }
          }
        },
        all: (promises) => {
          return Promise.all(promises)
        }
      }

      const events = Events(apiMock, qMock)
      events.addObservationsToEncounters(encounters)
    })
  })

  t.test('.constructSimpleLinkageToCareObject', { autoend: true }, (t) => {
    t.test('should construct simple linkage to care object', (t) => {
      const events = Events()

      const encounter = JSON.parse(JSON.stringify(encounterTemplate))
      encounter.period.start = '2017-04-04'
      encounter.type = [
        { coding: [ { system: 'http://hearth.org/cbs/event-types', code: 'linkage-to-care', display: 'Linkage to Care' } ] },
        { coding: [ { system: 'http://hearth.org/cbs/encounter-types', code: 'anc-visit', display: 'ANC Visit' } ] }
      ]
      encounter.location[0].location.display = 'Chuk'

      const event = events.constructSimpleLinkageToCareObject(encounter)

      t.equals(event.eventType, 'linkage-to-care')
      t.equals(event.eventDate, '2017-04-04')
      t.equals(event.data.encounterType, 'ANC Visit')
      t.equals(event.data.encounterLocation, 'Chuk')
      t.end()
    })
  })

  t.test('.constructSimpleCD4CountObject', { autoend: true }, (t) => {
    t.test('should construct simple cd4 count object', (t) => {
      const events = Events()

      const encounter = JSON.parse(JSON.stringify(encounterTemplate))
      encounter.period.start = '2017-04-04'
      encounter.type = [
        { coding: [ { system: 'http://hearth.org/cbs/event-types', code: 'cd4-count', display: 'CD4 Count' } ] }
      ]
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

      const event = events.constructSimpleCD4CountObject(encounter, [observation])

      t.equals(event.eventType, 'cd4-count')
      t.equals(event.eventDate, '2017-04-04')
      t.equals(event.data.cd4CountDate, '2017-05-05')
      t.equals(event.data.cd4CountLocation, 'Chuk')
      t.equals(event.data.cd4CountResult, 'Test Result')
      t.equals(event.data.cd4CountProvider, 'Test Provider')
      t.end()
    })
  })
})
