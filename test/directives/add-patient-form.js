'use strict'

const tap = require('tap')
const sinon = require('sinon')

const addPatient = require('../../app/scripts/directives/add-patient-form')
const FHIR = require('../../app/scripts/services/FHIR/FHIR.js')()

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.FormBuilderAddPatient on scope and fetch correct form files', (t) => {
    // given
    const scope = {}
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        switch (file) {
          case 'app/scripts/directives/add-patient-form/forms/basic-info.json':
            resolve(require('../../app/scripts/directives/add-patient-form/forms/basic-info.json'))
            break
          case 'app/scripts/directives/add-patient-form/forms/address-info.json':
            resolve(require('../../app/scripts/directives/add-patient-form/forms/address-info.json'))
            break
          case 'app/scripts/services/FHIR/resources/Patient.json':
            resolve(require('../../app/scripts/services/FHIR/resources/Patient.json'))
            break
          default:
            t.fail(`Unknown file: ${file}`)
        }
      })
    }
    const allMock = (promises) => {
      return Promise.all(promises)
    }
    const stateMock = {
      getPartialPatientDemographics: () => { return {} },
      setPartialPatientDemographics: () => {}
    }
    const directive = addPatient({}, { fetch: fetchMock }, { all: allMock }, stateMock, FHIR)
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderAddPatient)
    setTimeout(() => {
      t.equals(scope.state.FormBuilderAddPatient.sections.length, 2)
      t.end()
    }, 500)
  })

  t.test('should set partial patient details on the form', (t) => {
    // given
    const scope = {}
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        switch (file) {
          case 'app/scripts/directives/add-patient-form/forms/basic-info.json':
            resolve(require('../../app/scripts/directives/add-patient-form/forms/basic-info.json'))
            break
          case 'app/scripts/directives/add-patient-form/forms/address-info.json':
            resolve(require('../../app/scripts/directives/add-patient-form/forms/address-info.json'))
            break
          case 'app/scripts/services/FHIR/resources/Patient.json':
            resolve(require('../../app/scripts/services/FHIR/resources/Patient.json'))
            break
        }
      })
    }

    const allMock = (promises) => {
      return Promise.all(promises)
    }

    const stateMock = {
      getPartialPatientDemographics: () => {
        return {
          name: [
            {
              given: ['given'],
              family: ['family']
            }
          ],
          gender: 'female'
        }
      },
      setPartialPatientDemographics: () => {}
    }
    const directive = addPatient({}, { fetch: fetchMock }, { all: allMock }, stateMock, FHIR)
    directive.link(scope)

    // wait 50ms to ensure sections have been added to FormBuilder
    setTimeout(function () {
      // then
      const givenNameActual = scope.state.FormBuilderAddPatient.sections[0].rows[0].fields[1].value
      t.equals(givenNameActual, 'given')
      const familyNameActual = scope.state.FormBuilderAddPatient.sections[0].rows[0].fields[3].value
      t.equals(familyNameActual, 'family')
      const genderNameActual = scope.state.FormBuilderAddPatient.sections[0].rows[0].fields[4].value
      t.equals(genderNameActual, 'female')
      t.end()
    }, 100)
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
        t.equals(path, '/patients') // redirect to /patients i.e. search page
        t.end()
      }
    }
    const directive = addPatient({}, {}, {}, stateMock, {}, locationMock)
    // when
    directive.link(scope)
  })

  t.test('.submit()', { autoend: true }, (t) => {
    t.test('should resolve with a success message', (t) => {
      // given
      const scope = {}
      const mockFormData = {
        gender: { $modelValue: 'male', $dirty: true }
      }
      const fetchMock = (file) => {
        return new Promise((resolve, reject) => {
          switch (file) {
            case 'app/scripts/directives/add-patient-form/forms/basic-info.json':
              resolve(require('../../app/scripts/directives/add-patient-form/forms/basic-info.json'))
              break
            case 'app/scripts/directives/add-patient-form/forms/address-info.json':
              resolve(require('../../app/scripts/directives/add-patient-form/forms/address-info.json'))
              break
            case 'app/scripts/services/FHIR/resources/Patient.json':
              resolve(require('../../app/scripts/services/FHIR/resources/Patient.json'))
              break
          }
        })
      }
      const allMock = (promises) => {
        return Promise.all(promises)
      }
      const deferMock = () => {
        return {
          resolve: (result) => {
            // then
            t.equals(result.isValid, true)
            t.equals(result.msg, 'Patient saved successfully')
            t.end()
          }
        }
      }
      const patientApiMock = {
        save: (body, success) => {
          return success({}, (header) => {
            const headers = { location: 'aaa/bbb/ccc' }
            return headers[header]
          })
        }
      }
      const stateMock = {
        getPartialPatientDemographics: () => { return {} },
        setPartialPatientDemographics: () => {}
      }

      const directive = addPatient({ Patients: patientApiMock }, { fetch: fetchMock }, { all: allMock, defer: deferMock }, stateMock, FHIR, { path: () => {} })
      directive.link(scope)
      // when
      setTimeout(() => {
        t.equals(scope.state.FormBuilderAddPatient.sections.length, 2)
        scope.state.FormBuilderAddPatient.submit.execute(mockFormData)
      }, 200)
    })

    t.test('should resolve with the correct error message', (t) => {
      // given
      const scope = {}
      const mockFormData = {
        gender: { $modelValue: 'male', $dirty: true }
      }
      const fetchMock = (file) => {
        return new Promise((resolve, reject) => {
          switch (file) {
            case 'app/scripts/directives/add-patient-form/forms/basic-info.json':
              resolve(require('../../app/scripts/directives/add-patient-form/forms/basic-info.json'))
              break
            case 'app/scripts/directives/add-patient-form/forms/address-info.json':
              resolve(require('../../app/scripts/directives/add-patient-form/forms/address-info.json'))
              break
            case 'app/scripts/directives/add-patient-form/forms/hiv-info.json':
              resolve(require('../../app/scripts/directives/add-patient-form/forms/hiv-info.json'))
              break
            case 'app/scripts/services/FHIR/resources/Patient.json':
              resolve(require('../../app/scripts/services/FHIR/resources/Patient.json'))
              break
          }
        })
      }
      const allMock = (promises) => {
        return Promise.all(promises)
      }
      const deferMock = () => {
        return {
          reject: (result) => {
            // then
            t.equals(result.isValid, false)
            t.equals(result.msg, 'Internal Server Error')
            t.end()
          }
        }
      }
      const patientApiMock = {
        save: (body, success, error) => {
          return error({ statusText: 'Internal Server Error' })
        }
      }
      const stateMock = {
        getPartialPatientDemographics: () => { return {} },
        setPartialPatientDemographics: () => {}
      }

      const directive = addPatient({ Patients: patientApiMock }, { fetch: fetchMock }, { all: allMock, defer: deferMock }, stateMock, FHIR)
      directive.link(scope)
      // when
      setTimeout(() => {
        t.equals(scope.state.FormBuilderAddPatient.sections.length, 2)
        scope.state.FormBuilderAddPatient.submit.execute(mockFormData)
      }, 200)
    })

    t.test('should send the correct fhir patient to the Api', (t) => {
      // given
      const scope = {}
      const mockFormData = {
        // Basic Info
        ImmunisationID: { $modelValue: '1111111111', $dirty: true },
        firstname: { $modelValue: 'Namey', $dirty: true },
        middleNames: { $modelValue: 'middleNamey', $dirty: true },
        lastName: { $modelValue: 'Surnamey', $dirty: true },
        gender: { $modelValue: 'male', $dirty: true },
        preferredLanguage: { $modelValue: 'xhosa', $dirty: true },

        // Address Info
        province: { $modelValue: 'Provey', $dirty: true },
        district: { $modelValue: 'Disty', $dirty: true },
        sector: { $modelValue: 'Secty', $dirty: true },
        cell: { $modelValue: 'Celly', $dirty: true },
        umudugudu: { $modelValue: 'Ummy', $dirty: true }

      }
      const fetchMock = (file) => {
        return new Promise((resolve, reject) => {
          switch (file) {
            case 'app/scripts/directives/add-patient-form/forms/basic-info.json':
              resolve(require('../../app/scripts/directives/add-patient-form/forms/basic-info.json'))
              break
            case 'app/scripts/directives/add-patient-form/forms/address-info.json':
              resolve(require('../../app/scripts/directives/add-patient-form/forms/address-info.json'))
              break
            case 'app/scripts/services/FHIR/resources/Patient.json':
              resolve(require('../../app/scripts/services/FHIR/resources/Patient.json'))
              break
          }
        })
      }
      const allMock = (promises) => {
        return Promise.all(promises)
      }
      const deferMock = () => {
        return {
          resolve: (result) => {
            // then
            t.equals(result.isValid, true)
            t.equals(result.msg, 'Patient mapped to FHIR document!')
          }
        }
      }

      const savePatientMock = (patient) => {
        // Basic Info
        t.equals(patient.identifier[0].value, '1111111111')
        t.equals(patient.name[0].given[0], 'Namey')
        t.equals(patient.name[0].given[1], 'middleNamey')
        t.equals(patient.name[0].family[0], 'Surnamey')
        t.equals(patient.gender, 'male')
        t.equals(patient.communication[0].language.text, 'xhosa')

        // Address Info
        t.equals(patient.address[0].state, 'Provey')
        t.equals(patient.address[0].district, 'Disty')
        t.equals(patient.address[0].line[0], 'Secty')
        t.equals(patient.address[0].line[1], 'Celly')
        t.equals(patient.address[0].line[2], 'Ummy')

        t.end()
      }

      const stateMock = {
        getPartialPatientDemographics: () => { return {} },
        setPartialPatientDemographics: () => {}
      }

      const directive = addPatient({ Patients: { save: savePatientMock } }, { fetch: fetchMock }, { all: allMock, defer: deferMock }, stateMock, FHIR)
      directive.link(scope)
      // when
      setTimeout(() => {
        t.equals(scope.state.FormBuilderAddPatient.sections.length, 2)
        scope.state.FormBuilderAddPatient.submit.execute(mockFormData)
      }, 100)
    })

    t.test('should handle the skip logic for language correctly', (t) => {
      // given
      const scope = {}
      const mockFormData = {
        preferredLanguage: { $modelValue: 'Other', $dirty: true },
        preferredLanguageOther: { $modelValue: 'French', $dirty: true }
      }
      const fetchMock = (file) => {
        return new Promise((resolve, reject) => {
          switch (file) {
            case 'app/scripts/directives/add-patient-form/forms/basic-info.json':
              resolve(require('../../app/scripts/directives/add-patient-form/forms/basic-info.json'))
              break
            case 'app/scripts/directives/add-patient-form/forms/address-info.json':
              resolve(require('../../app/scripts/directives/add-patient-form/forms/address-info.json'))
              break
            case 'app/scripts/services/FHIR/resources/Patient.json':
              resolve(require('../../app/scripts/services/FHIR/resources/Patient.json'))
              break
          }
        })
      }
      const allMock = (promises) => {
        return Promise.all(promises)
      }
      const deferMock = () => {
        return {
          resolve: (result) => {
            // then
            t.equals(result.isValid, true)
            t.equals(result.msg, 'Patient mapped to FHIR document!')
          }
        }
      }

      const savePatientMock = (patient) => {
        t.equals(patient.communication[0].language.text, 'French')
        t.end()
      }

      const stateMock = {
        getPartialPatientDemographics: () => { return {} },
        setPartialPatientDemographics: () => {}
      }

      const directive = addPatient({ Patients: { save: savePatientMock } }, { fetch: fetchMock }, { all: allMock, defer: deferMock }, stateMock, FHIR)
      directive.link(scope)
      // when
      setTimeout(() => {
        t.equals(scope.state.FormBuilderAddPatient.sections.length, 2)
        scope.state.FormBuilderAddPatient.submit.execute(mockFormData)
      }, 100)
    })
  })
})
