'use strict'

module.exports = function (Api, loadResource, $q, state, FHIR) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-patient-form/view.html',
    scope: {},
    link: function (scope) {
      var submit = function (form) {
        var defer = $q.defer()

        var formFieldsValues = {}
        for (var k in form) {
          if (form.hasOwnProperty(k)) {
            if (typeof form[k] === 'object' && form[k].hasOwnProperty('$modelValue') && form[k].$dirty) {
              formFieldsValues[k] = form[k].$modelValue
            }
          }
        }

        loadResource.fetch('app/scripts/services/FHIR/resources/Patient.json').then(function (fhirDoc) {
          var fhirObject = FHIR.mapFHIRObject(fhirDoc, scope.state.FormBuilderAddPatient, formFieldsValues)
          console.log(fhirObject)

          defer.resolve({ isValid: true, msg: 'Patient mapped to FHIR document!' })

          // TODO: API call to submit patient
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
          showReviewButton: false
        },
        sections: [],
        buttons: {
          submit: 'add patient'
        },
        submit: {
          execute: submit,
          params: []
        },
        saveAsDraft: false,
        AddPatient: {}
      }

      var sections = []
      loadResource.fetch('app/scripts/directives/add-patient-form/forms/basic-info.json').then(function (basicInfo) {
        loadResource.fetch('app/scripts/directives/add-patient-form/forms/address-info.json').then(function (addressInfo) {
          loadResource.fetch('app/scripts/directives/add-patient-form/forms/emergency-contact-info.json').then(function (emergencyContactInfo) {
            sections.push(basicInfo)
            sections.push(addressInfo)
            sections.push(emergencyContactInfo)

            scope.state.FormBuilderAddPatient.sections = sections
          })
        })
      })
    }
  }
}
