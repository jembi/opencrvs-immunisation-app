'use strict'

module.exports = function () {
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
    }
  }
}
