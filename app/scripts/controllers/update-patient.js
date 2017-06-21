
'use strict'

module.exports = function ($scope, $location, $routeParams, state, Api) {
  const GET_PATIENT_ERROR = 'Error: Failed to find patient with id:' + $routeParams.patientId
  $scope.patientId = $routeParams.patientId

  $scope.state = {
    patients: null,
    header: {
      title: 'Edit Patient',
      left: [
        {
          text: 'back',
          onClick: function () { $location.path('/events/' + $routeParams.patientId) }
        }
      ],
      right: []
    }
  }

  var success = function (patient) {
    if (!patient) {
      $scope.getPatientError = GET_PATIENT_ERROR
      return
    }

    $scope.partialDemographics = patient
    state.setPartialPatientDemographics($scope.partialDemographics)
  }

  var error = function (err) {
    $scope.getPatientError = err.statusText || GET_PATIENT_ERROR
    console.error(err)
  }

  Api.Patients.get({ id: $routeParams.patientId }, success, error)
}
