'use strict'

module.exports = function (Api, loadResource, $q) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/search-by-demographics/view.html',
    scope: {},
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

        console.log(formFieldsValues)

        // Api.fetchMatches()

        defer.resolve({ isValid: true, msg: 'Found some potential matches' })

        return defer.promise
      }

      scope.state = {}
      scope.state.FormBuilder = {
        name: 'searchByDemographics',
        displayType: null,
        globals: {
          viewModeOnly: false,
          showDraftSubmitButton: false,
          showReviewButton: false
        },
        sections: [],
        login: {},
        buttons: {
          submit: 'search'
        },
        submit: {
          execute: submit,
          params: []
        },
        saveAsDraft: false,
        searchByDemographics: {}
      }

      loadResource.fetch('app/scripts/directives/search-by-demographics/form.json').then(function (formSection) {
        scope.state.FormBuilder.sections.push(formSection)
      })
    }
  }
}
