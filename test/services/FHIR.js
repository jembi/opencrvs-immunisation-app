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

tap.test('.mapFHIRResources()', { autoend: true }, (t) => {
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
    const fhirResourceDict = FHIR.mapFHIRResources({ main: FHIREncounterResource }, FormBuilderInstance, mockFormData)
    const encounter = fhirResourceDict.main
    // then
    t.ok(encounter)

    t.equal(encounter.period.start, '2017-02-23', 'should have a start period of "2017-02-23"')
    t.equal(encounter.period.end, '2017-02-23', 'should have a end period of "2017-02-23"')

    t.equal(encounter.type[1].coding[0].code, 'pmtct-visit', 'should have a type.coding.code of "pmtct-visit"')
    t.equal(encounter.type[1].coding[0].display, 'PMTCT visit', 'should have a end period of "PMTCT visit"')

    t.equal(encounter.class, 'HIVAIDS', 'should have a class of "HIVAIDS"')

    t.equal(encounter.location[0].location.display, 'Kacyiru Police Hospital', 'should have a location.display of "Kacyiru Police Hospital"')
    t.end()
  })
})

tap.test('.mapFHIRObjectToFormFields', { autoend: true }, (t) => {
  t.test('should map FHIR document to FormBuilder field values', (t) => {
    const formSchema = require('../../app/scripts/directives/add-patient-form/forms/basic-info')
    const fhirObject = {
      name: [ { prefix: [ 'Mr' ] } ],
      gender: 'male',
      telecom: [ { use: 'Mobile', system: 'phone', value: '1234' }, { system: 'email', value: 'aa@aa' } ]
    }

    const formFieldValues = FHIR.mapFHIRObjectToFormFields(formSchema, fhirObject)

    t.equal(formFieldValues.gender, 'male')
    t.equal(formFieldValues.title, 'Mr')
    t.equal(formFieldValues.emailAddress, 'aa@aa')
    t.equal(formFieldValues.contactNumber, '1234')
    t.equal(formFieldValues.contactNumberType, 'Mobile')
    t.end()
  })
})
