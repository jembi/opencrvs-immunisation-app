'use strict'

var moment = require('moment')

module.exports = function (Api, loadResource, $q, state, FHIR, $location) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-patient-form/view.html',
    scope: {},
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
          formFieldsValues.dob = moment(formFieldsValues.dob).format('YYYY-MM-DD')
          formFieldsValues.firstPostitiveHivTestDate = moment(formFieldsValues.firstPostitiveHivTestDate).format('YYYY-MM-DD')
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
          showReviewButton: false,
          messageTimeout: 5000
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

      var promises = []
      promises.push(loadResource.fetch('app/scripts/directives/add-patient-form/forms/basic-info.json'))
      promises.push(loadResource.fetch('app/scripts/directives/add-patient-form/forms/address-info.json'))
      promises.push(loadResource.fetch('app/scripts/directives/add-patient-form/forms/emergency-contact-info.json'))
      promises.push(loadResource.fetch('app/scripts/directives/add-patient-form/forms/hiv-info.json'))

      $q.all(promises).then(function (results) {
        // set partial patient demographics in the form
        var partialDemographics = state.getPartialPatientDemographics()
        state.setPartialPatientDemographics(null)

        results[0].rows[0].fields[2].value = partialDemographics.givenName
        results[0].rows[0].fields[4].value = partialDemographics.familyName
        results[0].rows[0].fields[7].value = partialDemographics.gender
        results[0].rows[0].fields[8].value = partialDemographics.birthDate

        scope.state.FormBuilderAddPatient.sections = results
      })
    }
  }
}
