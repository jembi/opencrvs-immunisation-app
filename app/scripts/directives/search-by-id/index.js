'use strict'

module.exports = function (Api, loadResource, $q) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/search-by-id/view.html',
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

        // Api.getPatient()
        defer.resolve({ isValid: true, msg: 'Success' })
        return defer.promise
      }

      scope.state.FormBuilderSearchById = {
        name: 'searchById',
        displayType: null,
        globals: {},
        sections: [],
        searchById: {},
        buttons: {
          submit: 'search'
        },
        submit: {
          execute: submit,
          params: []
        }
      }

      loadResource.fetch('app/scripts/directives/search-by-id/form.json').then(function (formSection) {
        scope.state.FormBuilderSearchById.sections.push(formSection)
      })
    }
  }
}
