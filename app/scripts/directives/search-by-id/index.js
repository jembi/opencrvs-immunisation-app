'use strict'

module.exports = function (Api, loadResource, $q) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/search-by-id/view.html',
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

        // Api.getPatient()
        defer.resolve({ isValid: true, msg: 'Success' })
        return defer.promise
      }

      scope.state = {}
      scope.state.FormBuilder = {
        name: 'searchById',
        displayType: null,
        globals: {},
        sections: [],
        login: {},
        buttons: {
          submit: 'search'
        },
        submit: {
          execute: submit,
          params: []
        }
      }

      loadResource.fetch('app/scripts/directives/search-by-id/form.json').then(function (formSection) {
        scope.state.FormBuilder.sections.push(formSection)
      })
    }
  }
}
