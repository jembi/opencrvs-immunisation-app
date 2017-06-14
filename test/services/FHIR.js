'use strict'

const tap = require('tap')
const sinon = require('sinon')

const FHIR = require('../../app/scripts/services/FHIR/FHIR.js')()

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.mapFHIRObject()', { autoend: true }, (t) => {
  t.test('should map FormBuilder field values to a FHIR document', (t) => {
    // given
    const FormBuilderLinkageToCare = require('../../app/scripts/directives/add-cbs-events/add-cbs-event/forms/linkage-to-care.json')
    const FormBuilderInstance = {
      sections: [FormBuilderLinkageToCare]
    }

    const FHIREncounterResource = require('../../app/scripts/services/FHIR/resources/Encounter.json')
    const mockFormData = {
      encounterDate: '2017-02-23',
      encounterLocation: 'Kacyiru Police Hospital',
      encounterType: 'pmtct-visit'
    }
    // when
    const encounter = FHIR.mapFHIRObject(FHIREncounterResource, FormBuilderInstance, mockFormData)
    // then
    t.ok(encounter)

    t.equal(encounter.period.start, '2017-02-23', 'should have a start period of "2017-02-23"')
    t.equal(encounter.period.end, '2017-02-23', 'should have a end period of "2017-02-23"')

    t.equal(encounter.type[0].coding[0].code, 'NEEDTOSETTHIS', 'should have a type.coding.code of "NEEDTOSETTHIS"')
    t.equal(encounter.type[0].coding[0].display, 'pmtct-visit', 'should have a end period of "pmtct-visit"')

    t.equal(encounter.class.system, 'http://hl7.org/fhir/v3/ActCode', 'should have a class.system of "http://hl7.org/fhir/v3/ActCode"')
    t.equal(encounter.class.code, 'HIVAIDS', 'should have a class.code of "HIVAIDS"')
    t.equal(encounter.class.display, 'HIV-AIDS program', 'should have a class.display of "HIV-AIDS program"')

    t.equal(encounter.location[0].location.display, 'Kacyiru Police Hospital', 'should have a location.display of "Kacyiru Police Hospital"')
    t.end()
  })
})
