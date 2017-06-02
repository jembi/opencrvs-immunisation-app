
'use strict'

module.exports = function ($scope, $location) {
  $scope.state = {
    patients: null,
    header: {
      title: 'Add Patient',
      left: [{ text: 'cancel', onClick: function () { $location.path('/patients') } }],
      right: []
    }
  }
}
