'use strict'

module.exports = function (Api, loadResource, $q, state, FHIR) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-cbs-events/linkage-to-care/view.html',
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

        loadResource.fetch('app/scripts/services/FHIR/resources/Encounter.json').then(function (fhirDoc) {
          var fhirObject = FHIR.mapFHIRObject(fhirDoc, scope.state.FormBuilderAddCbsEventLinkageToCare, formFieldsValues)
          console.log(fhirObject)
          defer.resolve({ isValid: true, msg: 'Event mapped to FHIR document!' })

          // TODO: API call to submit document
          // OR - Save to holding object to be sent in bundle
        })

        return defer.promise
      }

      scope.state = {}
      scope.state.FormBuilderAddCbsEventLinkageToCare = {
        name: 'AddCbsEventLinkageToCare',
        displayType: null,
        globals: {
          viewModeOnly: false,
          showDraftSubmitButton: false,
          showReviewButton: false
        },
        sections: [],
        buttons: {
          submit: 'search'
        },
        submit: {
          execute: submit,
          params: []
        },
        saveAsDraft: false,
        AddCbsEventLinkageToCare: {}
      }

      loadResource.fetch('app/scripts/directives/add-cbs-events/linkage-to-care/form.json').then(function (formSection) {
        scope.state.FormBuilderAddCbsEventLinkageToCare.sections.push(formSection)
      })
    }
  }
}
