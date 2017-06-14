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
      eventType: 'cd4-count',
      eventTitle: 'CD4 count',
      eventDate: moment(new Date()).fromNow(),
      data: {
        cd4CountDate: new Date().toLocaleString(),
        cd4CountLocation: 'Test Clinic',
        cd4CountResult: '285',
        cd4CountProvider: 'Dr Smith'
      }
    },
    {
      eventType: 'viral-load',
      eventTitle: 'Viral Load',
      eventDate: moment(new Date('2017-06-10')).fromNow(),
      data: {
        firstViralLoadDate: new Date().toLocaleString(),
        firstViralLoadResults: '400',
        firstViralLoadLocation: 'Test Clinic',
        firstViralLoadProvider: 'Dr Smith'
      }
    },
    {
      eventType: 'linkage-to-care',
      eventTitle: 'Linkage to care',
      eventDate: moment(new Date('2017-06-03')).fromNow(),
      data: {
        encounterType: 'PMTCT',
        encounterLocation: 'Test Clinic'
      }
    },
    {
      eventType: 'hiv-confirmation',
      eventTitle: 'HIV positive confirmation',
      eventDate: moment(new Date('2017-06-01')).fromNow(),
      data: {
        partnerStatus: 'Negative',
        firstPositiveHivTestLocation: 'Test Clinic',
        firstPositiveHivTestDate: new Date().toLocaleString()
      }
    }
  ]

  // TODO
  // $scope.event = events.getAllEvents($routeParams.patientId) // or similar
}
