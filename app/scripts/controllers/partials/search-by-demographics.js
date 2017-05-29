'use strict'

module.exports = function ($scope) {
  console.log('Loaded search-by-demographics controller')

  var submitSearchByDemographics = function () {
    console.log('SUBMIT')
  }

  $scope.state = {}
  $scope.state.FormBuilder = {
    name: 'SearchByDemographics',
    displayType: null,
    globals: {
      viewModeOnly: false,
      showReviewButton: false
    },
    sections: [
      {
        key: 'sec1',
        name: 'Section 1',
        displayName: 'Search by Demographics',
        flex: '100',
        rows: [
          {
            name: 'Row 1',
            layout: 'row',
            fields: [
              {
                type: 'input',
                flex: '25',
                name: 'input',
                title: 'Given Name',
                settings: {
                  valueType: 'valueString',
                  disabled: false,
                  required: true
                },
                skipLogic: {
                  func: {},
                  checks: []
                },
                value: null
              },
              {
                type: 'input',
                flex: '25',
                name: 'input',
                title: 'Family Name',
                settings: {
                  valueType: 'valueString',
                  disabled: false,
                  required: true
                },
                skipLogic: {
                  func: {},
                  checks: []
                },
                value: null
              }
            ]
          },
          {
            name: 'Row 2',
            layout: 'row',
            fields: [
              {
                type: 'date',
                flex: '25',
                name: 'input',
                title: 'Date of Birth',
                settings: {
                  valueType: 'valueString',
                  disabled: false,
                  required: true
                },
                skipLogic: {
                  func: {},
                  checks: []
                },
                value: null
              },
              {
                type: 'select',
                flex: '25',
                name: 'input',
                title: 'Gender',
                settings: {
                  valueType: 'valueString',
                  disabled: false,
                  required: true
                },
                skipLogic: {
                  func: {},
                  checks: []
                },
                options: [{ 'key': 'male', 'value': 'Male' }, { 'key': 'female', 'value': 'Female' }, { 'key': 'other', 'value': 'Other' }, { 'key': 'uknown', 'value': 'Unknown' }],
                value: null
              }
            ]
          }
        ]
      }
    ],
    FormBuilderForm: {},
    submit: {
      execute: submitSearchByDemographics,
      params: []
    }
  }
}
