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

          loadResource.fetch('app/scripts/services/FHIR/resources/Encounter.json').then((encounterTemplate) => {
            loadResource.fetch('app/scripts/services/FHIR/resources/RelatedPerson-motherDetails.json').then((motherTemplate) => {
              loadResource.fetch('app/scripts/services/FHIR/resources/Location.json').then((locationTemplate) => {
                loadResource.fetch('app/scripts/services/FHIR/resources/Immunization.json').then((immunisationTemplate) => {
                  let resourceTemplateDict
                  switch (scope.event.code) {
                    case 'birth-notification':
                      setProcedureEventType(encounterTemplate, scope.event.code, 'Birth Notification')
                      motherTemplate.patient.reference = scope.patient.resourceType + '/' + scope.patient.id
                      resourceTemplateDict = {
                        main: encounterTemplate,
                        childDetails: scope.patient.toJSON(),
                        motherDetails: motherTemplate,
                        location: locationTemplate
                      }
                      break
                    case 'immunisation':
                      setProcedureEventType(encounterTemplate, scope.event.code, scope.event.display)
                      immunisationTemplate.patient.reference = scope.patient.resourceType + '/' + scope.patient.id
                      resourceTemplateDict = {
                        main: encounterTemplate,
                        location: locationTemplate,
                        immunisation: immunisationTemplate
                      }
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

        // disable form when event has been added to array - only one event at a time
        scope.$watch(function () { return state.getEventsArray() }, function (events) {
          if (events) {
            if (events.length > 0) {
              scope.state[scope.event.formName].globals.viewModeOnly = true
            } else {
              scope.state[scope.event.formName].globals.viewModeOnly = false
            }
          }
        }, true)
      })
    }
  }
}
