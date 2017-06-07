'use strict'

module.exports = function (Api, loadResource, $q, state, FHIR, $location) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-patient-form/view.html',
    scope: {},
    link: function (scope) {
      if (!state.getPartialPatientDemographics()) {
        return $location.path('/')
      }

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

          Api.Patients.save(fhirObject, function (bundle) {
            defer.resolve({ isValid: true, msg: 'Patient has been created successfully' })
          }, function (err) {
            console.error(err)
            defer.reject(err)
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

            // set partial patient demographics in the form
            var partialDemographics = state.getPartialPatientDemographics()
            state.setPartialPatientDemographics(null)

            basicInfo.rows[0].fields[2].value = partialDemographics.givenName
            basicInfo.rows[0].fields[4].value = partialDemographics.familyName
            basicInfo.rows[0].fields[7].value = partialDemographics.gender
            basicInfo.rows[0].fields[8].value = partialDemographics.birthDate
          })
        })
      })
    }
  }
}
