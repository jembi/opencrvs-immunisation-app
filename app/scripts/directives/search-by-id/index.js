'use strict'

module.exports = function (Api, loadResource, $q, state, FormBuilderService) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/search-by-id/view.html',
    scope: {},
    link: function (scope) {
      var submit = function (form) {
        var defer = $q.defer()

        scope.$on('clear-search-form', () => {
          FormBuilderService.resetForm(scope.state.FormBuilderSearchById, form)
        })

        var formFieldsValues = {}
        for (var k in form) {
          if (form.hasOwnProperty(k)) {
            if (typeof form[k] === 'object' && form[k].hasOwnProperty('$modelValue') && form[k].$dirty) {
              formFieldsValues[k] = form[k].$modelValue
            }
          }
        }

        var patientId = formFieldsValues.tracNetID
        Api.Patients.get({ identifier: patientId }, function (result) {
          state.setSearchResults(result.entry)
          state.setSearchType('tracNetId')
          defer.resolve({ isValid: true, msg: 'Search Successful' })
        }, function (err) {
          console.error(err)
          defer.reject({ isValid: false, msg: err.statusText || 'Could not connect to server' })
        })

        return defer.promise
      }

      scope.state = {}
      scope.state.FormBuilderSearchById = {
        name: 'searchById',
        displayType: null,
        globals: {
          messageTimeout: 5000
        },
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
