'use strict'

module.exports = function (Api, $scope, $routeParams) {
  var GET_PATIENT_ERROR = 'Error: Failed to find patient with id:' + $routeParams.patientId

  $scope.state = {
    patients: null,
    singlePatient: true,
    header: {
      title: 'Add CBS Events',
      left: [
        {
          text: 'cancel',
          onClick: function () { console.log('TODO: Navigate back to view patient page') }
        }
      ],
      right: []
    }
  }

  var success = function (results) {
    if (!results) {
      $scope.getPatientError = GET_PATIENT_ERROR
    }
    $scope.state.patients = [{ resource: results }]
  }

  var error = function (err) {
    $scope.getPatientError = err.statusText || GET_PATIENT_ERROR
    console.error(err)
  }

  Api.Patients.get({ id: $routeParams.patientId }, success, error)

  $scope.eventTitles = [
    'HIV confirmation',
    'Linkage to care',
    'First CD4 count',
    'First viral load'
  ]

  $scope.setSelectedEvent = function (selectedEvent) {
    $scope.selectedEvent = selectedEvent
  }
}
