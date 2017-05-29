'use strict'

module.exports = function (Api, loadResource) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/search-by-id/view.html',
    scope: {},
    link: function (scope) {
      var submit = function (form) {
        var formFieldsValues = {}
        for (var k in form) {
          if (form.hasOwnProperty(k)) {
            if (typeof form[k] === 'object' && form[k].hasOwnProperty('$modelValue') && form[k].$dirty) {
              formFieldsValues[k] = form[k].$modelValue
            }
          }
        }

        // TODO
        // var patientId = formFieldsValues.tracknetid

        // var success = function (result) {
        //   return { isValid: true, msg: 'Success' }
        // }

        // var error = function (err) {
        //   return { isValid: false, msg: 'Error' }
        // }

        // return Api.Patient.get(patientId).$promise.then(success, error)
        return { isValid: true, msg: 'Success' }
      }

      scope.state = {}
      scope.state.FormBuilder = {
        name: 'search-by-id',
        displayType: null,
        globals: { },
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
