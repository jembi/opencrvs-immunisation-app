'use strict'

module.exports = function ($scope) {
  $scope.dashboardHeaderItems = {
    title: 'Add CBS events',
    left: 'Cancel',
    right: ''
  }

  $scope.eventTitles = [
    'HIV confirmation',
    'Linkage to care',
    'First CD4 count',
    'First viral load'
  ]

  $scope.patientDetails = {
    givenName: 'DummyName',
    familyName: 'DummySurname',
    gender: 'male',
    birthDate: '1990-03-05'
  }

  $scope.setSelectedEvent = function (selectedEvent) {
    console.log(selectedEvent)
    $scope.selectedEvent = selectedEvent
  }
}
