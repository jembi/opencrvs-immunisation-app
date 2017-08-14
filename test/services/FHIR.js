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
    const FormBuilderAddEventBirthNotification = require('../../app/scripts/directives/add-events/add-event/forms/birth-notification.json')
    const FormBuilderInstance = {
      sections: [FormBuilderAddEventBirthNotification]
    }

    const mockFormData = {
      birthPlace: 'GoodHealth Clinic, Durban',
      birthDate: '2017-02-23',
      mothersGivenName: 'Mary',
      mothersFamilyName: 'Smith',
      mothersContactNumber: '+27725556784'
    }
    // when
    const fhirResourceDict = FHIR.mapFHIRResources({
      childDetails: require('../../app/scripts/services/FHIR/resources/Patient.json'),
      motherDetails: require('../../app/scripts/services/FHIR/resources/RelatedPerson-motherDetails.json'),
      location: require('../../app/scripts/services/FHIR/resources/Location.json')
    }, FormBuilderInstance, mockFormData)

    const childDetails = fhirResourceDict.childDetails
    const motherDetails = fhirResourceDict.motherDetails
    const location = fhirResourceDict.location

    // then
    t.ok(childDetails)
    t.ok(motherDetails)
    t.ok(location)

    t.equals(childDetails.birthDate, '2017-02-23')

    t.equals(motherDetails.name.given[0], 'Mary')
    t.equals(motherDetails.name.family[0], 'Smith')
    t.equals(motherDetails.telecom[0].value, '+27725556784')

    t.equals(location.name, 'GoodHealth Clinic, Durban')

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
