'use strict'

module.exports = function ($scope, $routeParams, events, $location) {
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
}
