'use strict'

module.exports = function (Api, $scope, $routeParams, $location) {
  var GET_PATIENT_ERROR = 'Error: Failed to find patient with id:' + $routeParams.patientId

  $scope.state = {
    patients: null,
    singlePatient: true,
    header: {
      title: 'Add Events',
      left: [
        {
          text: 'back',
          onClick: function () {
            $location.path('/events/' + $routeParams.patientId)
          }
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

  $scope.events = [
    { code: 'birth-notification', display: 'Birth Details', formName: 'FormBuilderAddEventBirthNotification' },
    { code: 'immunisation', display: 'Immunisation', formName: 'FormBuilderAddEventImmunisation' }
  ]

  $scope.selectedEvent = $scope.events[0]
  $scope.setSelectedEvent = function (selectedEvent) {
    $scope.selectedEvent = selectedEvent
  }
}
