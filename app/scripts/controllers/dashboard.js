'use strict'

module.exports = function ($scope, state, $location, $q, FHIR) {
  $scope.state = {
    patients: null,
    header: {
      title: 'Search for patient',
      left: [],
      right: []
    }
  }

  // Watch for changes in the state service - patients
  $scope.$watch(function () { return state.getSearchResults() }, function (newResults) {
    $scope.state.patients = newResults
    if (!newResults) {
      $scope.state.header.title = 'Search Patient'
      $scope.state.header.left = [] // hide the return to search button in top header
      $scope.state.header.right = [] // hide the create patient button in top header
    } else {
      $scope.state.header.title = 'Search Results (' + newResults.length + ')'
      $scope.state.header.left = [{ text: 'clear search', onClick: function () { state.setSearchResults(null) } }] // show the return to search button in top header
      $scope.state.header.right = [{ text: 'add patient', onClick: function () { $location.path('/add-patient') } }] // show the create patient button in top header
    }
  }, true)
}
