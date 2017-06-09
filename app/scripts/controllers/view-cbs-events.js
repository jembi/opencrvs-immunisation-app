'use strict'

module.exports = function ($scope, $routeParams, events) {
  console.log('View CBS event controller loaded')

  events.test()

  $scope.state = {
    header: {
      title: 'View patient\'s CBS timeline',
      left: [
        {
          text: 'back',
          onClick: function () {}
        }
      ],
      right: []
    }
  }
}
