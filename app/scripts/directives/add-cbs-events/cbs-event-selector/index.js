'use strict'

var mhdBuilder = require('../../../modules/mhd-doc-builder')

module.exports = function (Api, loadResource, state) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-cbs-events/cbs-event-selector/view.html',
    scope: {
      eventTitles: '=',
      setSelectedEvent: '&'
    },
    link: function (scope) {
      scope.selectEventClick = function (title) {
        scope.selectedEvent = title
        scope.setSelectedEvent({ selectedEvent: title })
      }

      scope.submitControl = null

      // add watcher to check when events are added to state service
      scope.$watch(function () { return state.getEventsArray() }, function (events) {
        if (events.length > 0) {
          var eventsString = (events.length > 1) ? 'events' : 'event'
          scope.submitControl = {
            status: 'info',
            displayText: 'You have ' + events.length + ' ' + eventsString + ' ready to be submitted'
          }
        }
      }, true)

      scope.clearEventsBundle = function () {
        scope.submitControl = null
        state.setEventsArray([])
      }

      scope.submitEventsBundle = function () {
        scope.submitControl.status = 'processing'
        scope.submitControl.displayText = 'Busy processing submitted events'

        var mhdTransaction = mhdBuilder.buildMHDTransaction('Patient/test', state.getEventsArray())
        Api.FhirRoot.save(mhdTransaction, function (result) {
          state.setEventsArray([])

          scope.submitControl.status = 'success'
          scope.submitControl.displayText = 'Events submitted successfully!'
        }, function (err) {
          scope.submitControl.status = 'error'
          scope.submitControl.displayText = err.statusText || 'Internal Server Error: Please contact your administrator to resolve the issue'
          console.error(err)
        })
      }
    }
  }
}
