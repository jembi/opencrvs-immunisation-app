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

          var formFieldsValues = {}
          for (var k in form) {
            if (form.hasOwnProperty(k)) {
              if (typeof form[k] === 'object' && form[k].hasOwnProperty('$modelValue') && form[k].$dirty) {
                formFieldsValues[k] = form[k].$modelValue
              }
            }
          }

          loadResource.fetch('app/scripts/services/FHIR/resources/Encounter.json').then(function (encounterTemplate) {
            let resourceTemplateDict
            switch (scope.cbsEvent.code) {
              case 'linkage-to-care':
                resourceTemplateDict = { main: encounterTemplate }
                break
              case 'hiv-confirmation':
                resourceTemplateDict = { main: encounterTemplate } // TODO
                break
              case 'cd4-count':
                resourceTemplateDict = { main: encounterTemplate } // TODO
                break
              case 'first-viral-load':
                resourceTemplateDict = { main: encounterTemplate } // TODO
                break
              default:
                console.error(`Unknown event code ${scope.cbsEvent.code}`)
            }

            const resourceDict = FHIR.mapFHIRResources(resourceTemplateDict, scope.state[scope.cbsEvent.formName], formFieldsValues)

            // add the Subject Reference - Patient/Reference
            resourceDict.main.patient.reference = scope.patient.resourceType + '/' + scope.patient.id

            state.pushToEventsArray(resourceDict)

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
