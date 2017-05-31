'use strict'

module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'app/scripts/directives/header/view.html',
    scope: {
      state: '='
    },
    link: function (scope) {
      // Move this into service one implemeneted - Re-used in patient list directive
      scope.clearSearch = function () {
        scope.state.patients = null
        scope.state.header.title = 'Search Patient'
        scope.state.header.left.clearSearchResults = false // hide the return to search button in top header
        scope.state.header.right.createPatient = false // hide the create patient button in top header
      }
    }
  }
}
