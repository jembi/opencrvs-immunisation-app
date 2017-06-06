'use strict'

module.exports = function (loadResource, $q, state, FHIR) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-cbs-events/linkage-to-care/view.html',
    scope: {
      subjectReference: '@'
    },
    link: function (scope) {
      console.log(state)
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

        loadResource.fetch('app/scripts/services/FHIR/resources/Encounter.json').then(function (fhirDoc) {
          var fhirObject = FHIR.mapFHIRObject(fhirDoc, scope.state.FormBuilderAddCbsEventLinkageToCare, formFieldsValues)

          // add the Subject Refernce - Patient/Reference
          fhirObject.subject.reference = scope.subjectReference

          // TODO: Add document to state bundle for submission
          state.pushToEventsArray(fhirObject)

          scope.resetForm(scope.state.FormBuilderAddCbsEventLinkageToCare, form)

          defer.resolve({ isValid: true, msg: 'Event has been successfully added for submission' })
        })

        return defer.promise
      }

      scope.resetForm = function (formSchema, form) {
        for (var fbs = 0; fbs < formSchema.sections.length; fbs++) {
          var section = formSchema.sections[fbs]

          for (var fbr = 0; fbr < section.rows.length; fbr++) {
            var row = section.rows[fbr]

            for (var fbf = 0; fbf < row.fields.length; fbf++) {
              var field = row.fields[fbf]
              field.value = null // remove values from ngModel defined in FormBuilder schema
            }
          }
        }

        // remove validation errors
        form.$setPristine()
        form.$setUntouched()
      }

      scope.state = {}
      scope.state.FormBuilderAddCbsEventLinkageToCare = {
        name: 'AddCbsEventLinkageToCare',
        displayType: null,
        globals: {
          viewModeOnly: false,
          showDraftSubmitButton: false,
          showReviewButton: false
        },
        sections: [],
        buttons: {
          submit: 'Add'
        },
        submit: {
          execute: submit,
          params: []
        },
        saveAsDraft: false,
        AddCbsEventLinkageToCare: {}
      }

      loadResource.fetch('app/scripts/directives/add-cbs-events/linkage-to-care/form.json').then(function (formSection) {
        scope.state.FormBuilderAddCbsEventLinkageToCare.sections.push(formSection)
      })
    }
  }
}
