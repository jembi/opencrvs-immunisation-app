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
      $scope.state.header.title = 'Search for child'
      $scope.state.header.left = [] // hide the return to search button in top header
      $scope.state.header.right = [] // hide the create patient button in top header
    } else {
      $scope.state.header.title = 'Search Results (' + newResults.length + ')'
      $scope.state.header.left = [ // show the return to search button in top header
        {
          text: 'clear search',
          onClick: function () {
            state.setSearchResults(null)
            state.setPartialPatientDemographics(null)
            $scope.$broadcast('clear-search-form')
          }
        }
      ]

      $scope.$watch(function () { return state.getPartialPatientDemographics() }, function (partialDemographics) {
        if (partialDemographics) {
          $scope.state.header.right = [{ text: 'Create patient', onClick: function () { $location.path('/add-patient') } }] // show the create patient button in top header
        }
      })
    }
  }, true)

  $scope.$on('$destroy', function () {
    state.setSearchResults(null)
  })

  $scope.$on('clear-search', () => {
    $scope.$broadcast('clear-search-form')
  })
}
