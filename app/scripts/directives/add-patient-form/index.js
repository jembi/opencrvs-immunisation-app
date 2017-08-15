'use strict'

var moment = require('moment')

module.exports = function (Api, loadResource, $q, state, FHIR, $location) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-patient-form/view.html',
    scope: {
      patientId: '='
    },
    link: function (scope) {
      if (!state.getPartialPatientDemographics()) {
        return $location.path('/patients')
      }

      var submit = function (form) {
        var defer = $q.defer()

        var formFieldsValues = {}
        for (var k in form) {
          if (form.hasOwnProperty(k)) {
            if (typeof form[k] === 'object' && form[k].hasOwnProperty('$modelValue')) {
              formFieldsValues[k] = form[k].$modelValue
            }
          }
        }

        loadResource.fetch('app/scripts/services/FHIR/resources/Patient.json').then(function (fhirDoc) {
          formFieldsValues.firstPostitiveHivTestDate = moment(formFieldsValues.firstPostitiveHivTestDate).format('YYYY-MM-DD')
          var fhirResourceDict = FHIR.mapFHIRResources({ main: fhirDoc }, scope.state.FormBuilderAddPatient, formFieldsValues)

          fhirResourceDict.main.id = scope.patientId ? scope.patientId : undefined
          const method = scope.patientId ? 'update' : 'save'

          Api.Patients[method](fhirResourceDict.main, function (bundle, headers) {
            defer.resolve({ isValid: true, msg: 'Patient saved successfully' })
            const patientId = headers('location').split('/')[3]
            $location.path('/events/' + patientId)
          }, function (err) {
            defer.reject({ isValid: false, msg: err.statusText || 'Could not connect to server' })
          })
        })

        return defer.promise
      }

      scope.state = {}
      scope.state.FormBuilderAddPatient = {
        name: 'AddPatient',
        displayType: 'tabs',
        globals: {
          viewModeOnly: false,
          showDraftSubmitButton: false,
          showReviewButton: false,
          messageTimeout: 5000
        },
        sections: [],
        buttons: {
          submit: scope.patientId ? 'edit patient' : 'add patient'
        },
        submit: {
          execute: submit,
          params: []
        },
        saveAsDraft: false,
        AddPatient: {}
      }

      var promises = []
      promises.push(loadResource.fetch('app/scripts/directives/add-patient-form/forms/basic-info.json'))
      promises.push(loadResource.fetch('app/scripts/directives/add-patient-form/forms/address-info.json'))

      $q.all(promises).then((formSections) => {
        // set partial patient demographics in the form
        const partialFHIRDemographics = state.getPartialPatientDemographics()
        state.setPartialPatientDemographics(null)

        const partialFormDemographics = {}
        formSections.forEach((formSection) => {
          Object.assign(partialFormDemographics, FHIR.mapFHIRObjectToFormFields(formSection, partialFHIRDemographics))
        })

        Object.keys(partialFormDemographics).forEach((formFieldName) => {
          formSections.forEach((formSection) => {
            formSection.rows[0].fields.forEach((field) => {
              if (field.name === formFieldName) {
                field.value = partialFormDemographics[formFieldName]
              }
            })
          })
        })

        scope.state.FormBuilderAddPatient.sections = formSections
      })
    }
  }
}
