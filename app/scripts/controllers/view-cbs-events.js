'use strict'

module.exports = function ($scope, $routeParams, events, $location, Api) {
  const patientId = $routeParams.patientId
  const GET_PATIENT_ERROR = 'Error: Failed to find patient with id:' + patientId

  $scope.addEvent = () => {
    $location.path('/patients/' + patientId + '/add-events')
  }

  $scope.state = {
    patients: null,
    singlePatient: true,
    header: {
      title: 'View patient\'s CBS timeline',
      left: [
        {
          text: 'back',
          onClick: function () {
            $location.path('/patients')
          }
        }
      ],
      right: [
        {
          text: 'Add Event',
          onClick: $scope.addEvent
        }
      ]
    }
  }

  const success = function (results) {
    if (!results) {
      $scope.getPatientError = GET_PATIENT_ERROR
    }
    $scope.state.patients = [{ resource: results }]
  }

  const error = function (err) {
    $scope.getPatientError = err.statusText || GET_PATIENT_ERROR
    console.error(err)
  }

  Api.Patients.get({ id: patientId }, success, error)

  // get all encounters for a given patient ID
  events.getAllEncountersForPatient(patientId, (err, result) => {
    if (err) {
      console.err(err)
      // TODO: some UI message informing the user of the error
    }

    let promise = events.addObservationsToEncounters(result)
    promise.then(results => {
      const eventsDesc = events.sortEventsDesc(results)
      $scope.events = events.formatEvents(eventsDesc)
    })
  })
}
