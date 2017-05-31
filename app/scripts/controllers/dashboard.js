'use strict'

module.exports = function ($scope, loadResource, state) {
  $scope.state = {
    patients: null,
    header: {
      title: 'Search for patient',
      left: {
        returnToSearch: false
      },
      right: {
        createPatient: false
      }
    }
  }

  // Watch for changes in the state service - patients
  $scope.$watch(function () { return state.getSearchResults() }, function (newResults) {
    $scope.state.patients = newResults

    if (!newResults) {
      $scope.state.header.title = 'Search Patient'
      $scope.state.header.left.clearSearchResults = false // hide the return to search button in top header
      $scope.state.header.right.createPatient = false // hide the create patient button in top header
    } else {
      $scope.state.header.title = 'Search Results (' + newResults.length + ')'
      $scope.state.header.left.clearSearchResults = true // hide the return to search button in top header
      $scope.state.header.right.createPatient = true // hide the create patient button in top header
    }
  }, true)
}
