'use strict'

module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'app/scripts/directives/patients-list-row-details/view.html',
    scope: {
      patient: '='
    },
    link: function (scope) { }
  }
}
