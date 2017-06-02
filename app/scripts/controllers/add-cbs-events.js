'use strict'

module.exports = function (Api, $scope, $routeParams) {
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
    $scope.state.patients = [{ resource: results }]
  }

  var error = function (err) {
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
