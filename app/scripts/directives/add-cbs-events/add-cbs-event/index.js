'use strict'

module.exports = function (loadResource, $q, state, FHIR, FormBuilderService) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-cbs-events/add-cbs-event/view.html',
    scope: {
      patient: '=',
      cbsEvent: '='
    },
    link: function (scope) {
      scope.$watch('cbsEvent', () => {
        var submit = function (form) {
          var defer = $q.defer()

          const formFieldsValues = FormBuilderService.getFormFieldValues(form)

          loadResource.fetch('app/scripts/services/FHIR/resources/Encounter.json').then(function (fhirDoc) {
            var fhirObject = FHIR.mapFHIRObject(fhirDoc, scope.state[scope.cbsEvent.formName], formFieldsValues)

            fhirObject.patient.reference = scope.patient.resourceType + '/' + scope.patient.id

            state.pushToEventsArray(fhirObject)

            scope.resetForm(scope.state[scope.cbsEvent.formName], form)

            defer.resolve({ isValid: true, msg: 'Event has been successfully added for submission' })
          })

          return defer.promise
        }

        scope.resetForm = function (formSchema, form) {
          FormBuilderService.resetForm(formSchema, form)
        }

        scope.state = {}
        scope.state[scope.cbsEvent.formName] = {
          name: scope.cbsEvent.formName,
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
          [scope.cbsEvent.formName]: {}
        }

        loadResource.fetch(`app/scripts/directives/add-cbs-events/add-cbs-event/forms/${scope.cbsEvent.code}.json`).then(function (formSection) {
          scope.state[scope.cbsEvent.formName].sections.push(formSection)
        })
      })
    }
  }
}
