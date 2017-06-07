'use strict'

var moment = require('moment')

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

      var promises = []
      promises.push(loadResource.fetch('app/scripts/directives/add-patient-form/forms/basic-info.json'))
      promises.push(loadResource.fetch('app/scripts/directives/add-patient-form/forms/address-info.json'))
      promises.push(loadResource.fetch('app/scripts/directives/add-patient-form/forms/emergency-contact-info.json'))
      promises.push(loadResource.fetch('app/scripts/directives/add-patient-form/forms/hiv-info.json'))

      $q.all(promises).then(function (results) {
        scope.state.FormBuilderAddPatient.sections = results
      })
    }
  }
}
