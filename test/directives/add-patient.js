'use strict'

const tap = require('tap')
const sinon = require('sinon')

const FHIR = require('../../app/scripts/services/FHIR/FHIR.js')()
const addPatient = require('../../app/scripts/directives/add-patient-form')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.FormBuilderAddPatient on scope and fetch correct form files', (t) => {
    t.plan(4)
    // given
    const scope = {}
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        switch (file) {
          case 'app/scripts/directives/add-patient-form/forms/basic-info.json':
            const FormBuilderBasicInfo = require('../../app/scripts/directives/add-patient-form/forms/basic-info.json')
            t.ok(FormBuilderBasicInfo)
            resolve(FormBuilderBasicInfo)
            break
          case 'app/scripts/directives/add-patient-form/forms/address-info.json':
            const FormBuilderAddressInfo = require('../../app/scripts/directives/add-patient-form/forms/address-info.json')
            t.ok(FormBuilderAddressInfo)
            resolve(FormBuilderAddressInfo)
            break
          case 'app/scripts/directives/add-patient-form/forms/emergency-contact-info.json':
            const FormBuilderEmergencyContactInfo = require('../../app/scripts/directives/add-patient-form/forms/emergency-contact-info.json')
            t.ok(FormBuilderEmergencyContactInfo)
            resolve(FormBuilderEmergencyContactInfo)
            break
        }
      })
    }
    const stateMock = {
      getPartialPatientDemographics: () => { return {} },
      setPartialPatientDemographics: () => {}
    }
    const directive = addPatient({}, { fetch: fetchMock }, {}, stateMock, {})
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderAddPatient)
  })

  t.test('should set partial patient details on the form', (t) => {
    // given
    const scope = {}
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        switch (file) {
          case 'app/scripts/directives/add-patient-form/forms/basic-info.json':
            const FormBuilderBasicInfo = require('../../app/scripts/directives/add-patient-form/forms/basic-info.json')
            resolve(FormBuilderBasicInfo)
            break
          case 'app/scripts/directives/add-patient-form/forms/address-info.json':
            const FormBuilderAddressInfo = require('../../app/scripts/directives/add-patient-form/forms/address-info.json')
            resolve(FormBuilderAddressInfo)
            break
          case 'app/scripts/directives/add-patient-form/forms/emergency-contact-info.json':
            const FormBuilderEmergencyContactInfo = require('../../app/scripts/directives/add-patient-form/forms/emergency-contact-info.json')
            resolve(FormBuilderEmergencyContactInfo)
            break
          case 'app/scripts/services/FHIR/resources/Patient.json':
            const FHIRPatient = require('../../app/scripts/services/FHIR/resources/Patient.json')
            resolve(FHIRPatient)
            break
        }
      })
    }
    const stateMock = {
      getPartialPatientDemographics: () => {
        return {
          givenName: 'given',
          familyName: 'family',
          gender: 'female',
          birthDate: '1980-06-05'
        }
      },
      setPartialPatientDemographics: () => {}
    }
    const directive = addPatient({}, { fetch: fetchMock }, {}, stateMock, FHIR)
    directive.link(scope)

    // wait 50ms to ensure sections have been added to FormBuilder
    setTimeout(function () {
      // then
      const givenNameActual = scope.state.FormBuilderAddPatient.sections[0].rows[0].fields[2].value
      t.equals(givenNameActual, 'given')
      const familyNameActual = scope.state.FormBuilderAddPatient.sections[0].rows[0].fields[4].value
      t.equals(familyNameActual, 'family')
      const genderNameActual = scope.state.FormBuilderAddPatient.sections[0].rows[0].fields[7].value
      t.equals(genderNameActual, 'female')
      const birthDateNameActual = scope.state.FormBuilderAddPatient.sections[0].rows[0].fields[8].value
      t.equals(birthDateNameActual, '1980-06-05')
      t.end()
    }, 50)
  })

  t.test('should redirect when partial patient demographics aren\'t set', (t) => {
    // given
    const scope = {}
    const stateMock = {
      getPartialPatientDemographics: () => { return null }
    }
    const locationMock = {
      path: (path) => {
        // then
        t.equals(path, '/') // redirect to root i.e. search page
        t.end()
      }
    }
    const directive = addPatient({}, {}, {}, stateMock, {}, locationMock)
    // when
    directive.link(scope)
  })
})

tap.test('.submit()', { autoend: true }, (t) => {
  t.test('should resolve with a success message', (t) => {
    // given
    const scope = {}
    const ApiMock = (body, success) => {
      const expectedPatientResource = require('../resources/expected-patient-resource.json')
      // then
      t.deepEquals(body, expectedPatientResource)
      success({ entry: [] })
    }
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        switch (file) {
          case 'app/scripts/directives/add-patient-form/forms/basic-info.json':
            const FormBuilderBasicInfo = require('../../app/scripts/directives/add-patient-form/forms/basic-info.json')
            resolve(FormBuilderBasicInfo)
            break
          case 'app/scripts/directives/add-patient-form/forms/address-info.json':
            const FormBuilderAddressInfo = require('../../app/scripts/directives/add-patient-form/forms/address-info.json')
            resolve(FormBuilderAddressInfo)
            break
          case 'app/scripts/directives/add-patient-form/forms/emergency-contact-info.json':
            const FormBuilderEmergencyContactInfo = require('../../app/scripts/directives/add-patient-form/forms/emergency-contact-info.json')
            resolve(FormBuilderEmergencyContactInfo)
            break
          case 'app/scripts/services/FHIR/resources/Patient.json':
            const FHIRPatient = require('../../app/scripts/services/FHIR/resources/Patient.json')
            resolve(FHIRPatient)
            break
        }
      })
    }
    const deferMock = () => {
      return {
        resolve: (result) => {
          t.equals(result.isValid, true)
          t.equals(result.msg, 'Patient has been created successfully')
          t.end()
        }
      }
    }
    const stateMock = {
      getPartialPatientDemographics: () => { return {} },
      setPartialPatientDemographics: () => {}
    }
    const directive = addPatient({ Patients: { save: ApiMock } }, { fetch: fetchMock }, { defer: deferMock }, stateMock, FHIR)
    directive.link(scope)

    // wait 50ms to ensure sections have been added to FormBuilder
    setTimeout(function () {
      const mockFormData = require('../resources/mock-patient-form-data.json')
      // when
      scope.state.FormBuilderAddPatient.submit.execute(mockFormData)
    }, 50)
  })
})
