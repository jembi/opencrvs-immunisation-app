'use strict'

const moment = require('moment')

module.exports = function ($scope, $routeParams, events, $location, Api) {
  const GET_PATIENT_ERROR = 'Error: Failed to find patient with id:' + $routeParams.patientId

  $scope.addEvent = () => {
    $location.path('/patients/' + $routeParams.patientId + '/add-events')
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

  Api.Patients.get({ id: $routeParams.patientId }, success, error)

  $scope.events = [
    {
      eventTitle: 'CD4 count',
      eventDate: moment(new Date()).fromNow()
    },
    {
      eventTitle: 'Viral Load',
      eventDate: moment(new Date('2017-06-10')).fromNow()
    },
    {
      eventTitle: 'Linkage to care',
      eventDate: moment(new Date('2017-06-03')).fromNow()
    },
    {
      eventTitle: 'HIV Confirmation',
      eventDate: moment(new Date('2017-06-01')).fromNow()
    }
  ]

  // TODO
  // $scope.event = events.getAllEvents($routeParams.patientId) // or similar
}
