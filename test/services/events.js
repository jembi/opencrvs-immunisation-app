'use strict'

const tap = require('tap')

const Events = require('../../app/scripts/services/events')
const encounterTemplate = require('../../app/scripts/services/FHIR/resources/Encounter')
const observationTemplate = require('../../app/scripts/services/FHIR/resources/Observation')

tap.test('fetch encounters and return array', (t) => {
  // Encounters for Patient/12345
  const encounter1 = JSON.parse(JSON.stringify(encounterTemplate))
  encounter1.id = '1'
  encounter1.period.start = '2017-01-01'
  encounter1.location[0].location.display = 'Test Hospital 1'
  encounter1.subject.reference = 'Patient/12345'
  encounter1.type[0].coding[0].code = 'linkage-to-care'
  const encounter2 = JSON.parse(JSON.stringify(encounterTemplate))
  encounter2.id = '2'
  encounter2.period.start = '2017-02-02'
  encounter2.location[0].location.display = 'Test Hospital 2'
  encounter2.subject.reference = 'Patient/12345'
  encounter2.type[0].coding[0].code = 'first-cd4-count'

  const encountersBundle = { entry: [encounter1, encounter2] }

  const qMock = {
    defer: () => {
      return {
        resolve: (result) => {
          t.equals(result[0].id, '1')
          t.equals(result[1].id, '2')
          t.end()
        }
      }
    }
  }

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

  const events = Events(apiMock, qMock)
  events.getAllEncountersForPatient('12345')
  t.end()
})

tap.test('attach observations to encounters and return array', (t) => {
  // Encounters for Patient/12345
  const encounter1 = JSON.parse(JSON.stringify(encounterTemplate))
  encounter1.id = '1'
  encounter1.period.start = '2017-01-01'
  encounter1.location[0].location.display = 'Test Hospital 1'
  encounter1.subject.reference = 'Patient/12345'
  encounter1.type[0].coding[0].code = 'linkage-to-care'
  const encounter2 = JSON.parse(JSON.stringify(encounterTemplate))
  encounter2.id = '2'
  encounter2.period.start = '2017-02-02'
  encounter2.location[0].location.display = 'Test Hospital 2'
  encounter2.subject.reference = 'Patient/12345'
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
        return new Promise((resolve, reject) => {
          resolve({ entry: observations })
        })
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
