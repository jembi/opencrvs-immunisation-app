'use strict'

module.exports = function (loadResource, $q, state, FHIR, FormBuilderService) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-events/add-event/view.html',
    scope: {
      patient: '=',
      event: '='
    },
    link: function (scope) {
      const setProcedureEventType = (encounterTemplate, encounterType, encounterDisplay) => {
        // add encounter type.coding for event type
        encounterTemplate.type[0].coding[0] = {
          'system': 'http://hearth.org/crvs/event-types',
          'code': encounterType,
          'display': encounterDisplay
        }
      }

      scope.$watch('event', () => {
        var submit = function (form) {
          var defer = $q.defer()

          const formFieldsValues = FormBuilderService.getFormFieldValues(form)

          loadResource.fetch('app/scripts/services/FHIR/resources/Encounter.json').then(function (encounterTemplate) {
            loadResource.fetch('app/scripts/services/FHIR/resources/Observation.json').then(function (observationTemplate) {
              let resourceTemplateDict
              switch (scope.event.code) {
                case 'sample-event':
                  setProcedureEventType(encounterTemplate, scope.event.code, 'Sample Event')
                  resourceTemplateDict = { main: encounterTemplate }
                  break
                case 'immunisation-notification':
                  setProcedureEventType(encounterTemplate, scope.event.code, scope.event.display)
                  resourceTemplateDict = { main: encounterTemplate }
                  break
                default:
                  console.error(`Unknown event code ${scope.event.code}`)
              }

              const resourceDict = FHIR.mapFHIRResources(resourceTemplateDict, scope.state[scope.event.formName], formFieldsValues)

              // add the Subject Reference - Patient/Reference
              resourceDict.main.patient.reference = scope.patient.resourceType + '/' + scope.patient.id

              state.pushToEventsArray(resourceDict)

              scope.resetForm(scope.state[scope.event.formName], form)

              defer.resolve({ isValid: true, msg: 'Event has been successfully added for submission' })
            })
          })

          return defer.promise
        }

        scope.resetForm = function (formSchema, form) {
          FormBuilderService.resetForm(formSchema, form)
        }

        scope.state = {}
        scope.state[scope.event.formName] = {
          name: scope.event.formName,
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
          [scope.event.formName]: {}
        }

        loadResource.fetch(`app/scripts/directives/add-events/add-event/forms/${scope.event.code}.json`).then(function (formSection) {
          scope.state[scope.event.formName].sections.push(formSection)
        })
      })
    }
  }
}
