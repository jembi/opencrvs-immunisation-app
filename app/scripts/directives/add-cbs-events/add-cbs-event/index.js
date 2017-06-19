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
      const setProcedureEventType = (encounterTemplate, encounterType, encounterDisplay) => {
        // add encounter type.coding for event type
        encounterTemplate.type[0].coding[0] = {
          'system': 'http://hearth.org/cbs/event-types',
          'code': encounterType,
          'display': encounterDisplay
        }
      }

      scope.$watch('cbsEvent', () => {
        var submit = function (form) {
          var defer = $q.defer()

          const formFieldsValues = FormBuilderService.getFormFieldValues(form)

          const cloneDeep = (obj) => {
            return JSON.parse(JSON.stringify(obj))
          }

          loadResource.fetch('app/scripts/services/FHIR/resources/Encounter.json').then(function (encounterTemplate) {
            loadResource.fetch('app/scripts/services/FHIR/resources/Observation.json').then(function (observationTemplate) {
              let resourceTemplateDict
              switch (scope.cbsEvent.code) {
                case 'linkage-to-care':
                  setProcedureEventType(encounterTemplate, scope.cbsEvent.code, 'Linkage to Care')
                  resourceTemplateDict = { main: encounterTemplate }
                  break
                case 'hiv-confirmation':
                  setProcedureEventType(encounterTemplate, scope.cbsEvent.code, 'HIV Confirmation')
                  resourceTemplateDict = { main: encounterTemplate, subjectHIVObs: cloneDeep(observationTemplate), partnerHIVObs: cloneDeep(observationTemplate) }
                  break
                case 'cd4-count':
                  setProcedureEventType(encounterTemplate, scope.cbsEvent.code, 'CD4 Count')
                  resourceTemplateDict = { main: encounterTemplate, cd4CountObs: cloneDeep(observationTemplate) }
                  break
                case 'first-viral-load':
                  setProcedureEventType(encounterTemplate, scope.cbsEvent.code, 'First Viral Load')
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
