'use strict'

module.exports = function ($scope, loadResource) {
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
}
