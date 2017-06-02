'use strict'

module.exports = function (Api, loadResource, $q) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-cbs-events/linkage-to-care/view.html',
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

        // Api.saveCbsEvent()
        defer.resolve({ isValid: true, msg: 'Success' })
        return defer.promise
      }

      scope.state = {}
      scope.state.LinkageToCareForm = {
        name: 'linkageToCareForm',
        displayType: null,
        globals: {},
        sections: [],
        linkageToCareForm: {},
        buttons: {
          submit: 'add event'
        },
        submit: {
          execute: submit,
          params: []
        }
      }

      loadResource.fetch('app/scripts/directives/add-cbs-events/linkage-to-care/form.json').then(function (formSection) {
        scope.state.LinkageToCareForm.sections.push(formSection)
      })
    }
  }
}
