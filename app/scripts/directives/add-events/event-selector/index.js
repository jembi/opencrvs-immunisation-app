'use strict'

const mhdBuilder = require('../../../modules/mhd-doc-builder')

module.exports = function (Api, loadResource, state) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-events/event-selector/view.html',
    scope: {
      events: '=',
      setSelectedEvent: '&',
      patient: '='
    },
    link: function (scope) {
      scope.selectedEvent = scope.events[0]
      scope.selectEventClick = function (event) {
        scope.selectedEvent = event
        scope.setSelectedEvent({ selectedEvent: event })
      }

      scope.submitControl = null

      // add watcher to check when events are added to state service
      scope.$watch(function () { return state.getEventsArray() }, function (events) {
        if (events.length > 0) {
          scope.submitControl = {
            status: 'info',
            displayText: 'Event ready to be submitted'
          }
        }
      }, true)

      scope.clearEventsBundle = function () {
        scope.submitControl = null
        state.setEventsArray([])
      }

      scope.submitEventsBundle = function () {
        scope.submitControl.status = 'processing'
        scope.submitControl.displayText = 'Busy processing submitted event'

        const mhdTransaction = mhdBuilder.buildMHDTransaction(scope.patient.resourceType + '/' + scope.patient.id, state.getEventsArray())
        Api.FhirRoot.save(mhdTransaction, function (result) {
          state.setEventsArray([])

          scope.submitControl.status = 'success'
          scope.submitControl.displayText = 'Event submitted successfully!'
        }, function (err) {
          scope.submitControl.status = 'error'
          scope.submitControl.displayText = err.statusText || 'Internal Server Error: Please contact your administrator to resolve the issue'
          console.error(err)
        })
      }
    }
  }
}
