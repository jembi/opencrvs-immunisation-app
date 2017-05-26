'use strict'

module.exports = function () {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/dashboard-header/view.html',
    scope: {
      title: '='
    }
  }
}
