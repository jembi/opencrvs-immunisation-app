'use strict'

module.exports = function ($scope, $routeParams, events, $location, Api) {
  console.log('View CBS event controller loaded')

  events.test()

  $scope.state = {
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
          onClick: function () {
            $location.path('/patients/' + $routeParams.patientId + '/add-events')
          }
        }
      ]
    }
  }

  // API test
  var patientId = $routeParams.patientId

  Api.Encounters.get({patient: patientId}, function (result) {
    console.log(result)
  }, function (err) {
    console.error(err)
  })

  Api.Observations.get({'subject.reference': { $eq: 'Patient/' + patientId }}, function (result) {
    console.log(result)
  }, function (err) {
    console.error(err)
  })
}
