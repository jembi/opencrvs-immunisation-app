'use strict'

module.exports = function (loadResource, $q, state, FHIR, FormBuilderService) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-cbs-events/linkage-to-care/view.html',
    scope: {
      patient: '='
    },
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

          // add the Subject Refernce - Patient/Reference
          fhirObject.subject.reference = scope.patient.resourceType + '/' + scope.patient.id

          // TODO: Add document to state bundle for submission
          state.pushToEventsArray(fhirObject)

          scope.resetForm(scope.state.FormBuilderAddCbsEventLinkageToCare, form)

          defer.resolve({ isValid: true, msg: 'Event has been successfully added for submission' })
        })

        return defer.promise
      }

      scope.resetForm = function (formSchema, form) {
        FormBuilderService.resetForm(formSchema, form)
      }

      scope.state = {}
      scope.state.FormBuilderAddCbsEventLinkageToCare = {
        name: 'AddCbsEventLinkageToCare',
        displayType: null,
        globals: {
          viewModeOnly: false,
          showDraftSubmitButton: false,
          showReviewButton: false,
          messageTimeout: 5000
        },
        sections: [],
        buttons: {
          submit: 'Add'
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
