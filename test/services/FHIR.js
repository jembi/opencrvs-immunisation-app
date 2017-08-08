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
