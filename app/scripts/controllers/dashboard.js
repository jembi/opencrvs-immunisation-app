'use strict'

module.exports = function ($scope, loadResource) {
  $scope.dashboardHeaderItems = {
    title: 'Search for patient',
    left: 'Return to search',
    right: {
      createPatient: false 
    }
  }

  $scope.state = {
    patients: null
  }

  // TODO: API call to fetch patients
  // Mocked API call to fetch patients
  loadResource.fetch('app/scripts/directives/patients-list/sample-result.json').then(function (result) {
    $scope.state.patients = result // array of entries
    $scope.dashboardHeaderItems.right.createPatient = true // Show the create patient button in top header
  })
}
