'use strict'

module.exports = function (Api, loadResource, $q) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/search-by-demographics/view.html',
    scope: {
      state: '='
    },
    link: function (scope) {
      var submit = function (form) {
        var defer = $q.defer()

        var formFieldsValues = {}
        for (var k in form) {
          if (form.hasOwnProperty(k)) {
            if (typeof form[k] === 'object' && form[k].hasOwnProperty('$modelValue') && form[k].$dirty) {
              formFieldsValues[k] = form[k].$modelValue
            }
          }
        }

        // TODO: API call to fetch patients
        // Mocked API call to fetch patients
        loadResource.fetch('app/scripts/directives/patients-list/sample-result.json').then(function (results) {
          scope.state.patients = results // array of entries
        })

        // Api.fetchMatches()
        defer.resolve({ isValid: true, msg: 'Found some potential matches' })
        return defer.promise
      }

      scope.state.FormBuilderDemographics = {
        name: 'searchByDemographics',
        displayType: null,
        globals: {
          viewModeOnly: false,
          showDraftSubmitButton: false,
          showReviewButton: false
        },
        sections: [],
        searchByDemographics: {},
        buttons: {
          submit: 'search'
        },
        submit: {
          execute: submit,
          params: []
        },
        saveAsDraft: false
      }

      loadResource.fetch('app/scripts/directives/search-by-demographics/form.json').then(function (formSection) {
        scope.state.FormBuilderDemographics.sections.push(formSection)
      })
    }
  }
}
