'use strict'

const tap = require('tap')
const sinon = require('sinon')

const FHIR = require('../../app/scripts/services/FHIR/FHIR.js')()
const addPatient = require('../../app/scripts/directives/add-patient-form')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
// sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.FormBuilderAddPatient on scope and fetch correct form file', (t) => {
    // given
    let loadResourceCount = 0
    const scope = {}
    const fetchMock = (file) => {
      var fileToLoad = [
        'app/scripts/directives/add-patient-form/forms/basic-info.json',
        'app/scripts/directives/add-patient-form/forms/address-info.json',
        'app/scripts/directives/add-patient-form/forms/emergency-contact-info.json'
      ]

      var fileIndex = fileToLoad.indexOf(file)

      t.equals(file, fileToLoad[fileIndex])
      return new Promise((resolve, reject) => {
        resolve()
        loadResourceCount++
        if (loadResourceCount === 3) {
          t.end()
        }
      })
    }
    const directive = addPatient({}, { fetch: fetchMock }, {}, {}, {})
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderAddPatient)
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
          // then
          // TODO: Used in API call
          t.equals(result.isValid, true)
          t.equals(result.msg, 'Patient has been created successfully')
          t.end()
        }
      }
    }
    const directive = addPatient({ Patients: { save: ApiMock } }, { fetch: fetchMock }, { defer: deferMock }, {}, FHIR)
    directive.link(scope)

    // wait 50ms to ensure sections have been added to FormBuilder
    setTimeout(function () {
      const mockFormData = require('../resources/mock-patient-form-data.json')
      // when
      scope.state.FormBuilderAddPatient.submit.execute(mockFormData)
    }, 50)
  })
})
