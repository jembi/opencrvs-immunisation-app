'use strict'

module.exports = () => {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/display-event-data/view.html',
    scope: {
      event: '='
    },
    link: (scope) => {
      scope.url = `app/scripts/directives/display-event-data/${scope.event.eventType}.html`
    }
  }
}
