'use strict'

module.exports = function (state) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'app/scripts/directives/header/view.html',
    scope: {
      state: '='
    },
    link: function (scope) {
      scope.clearSearch = function () {
        state.setSearchResults(null)
      }
    }
  }
}
