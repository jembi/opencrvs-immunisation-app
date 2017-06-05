'use strict'

module.exports = function (Api, loadResource, $q, state, FHIR) {
  return {
    restrict: 'EA',
    templateUrl: 'app/scripts/directives/add-patient-form/view.html',
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

        loadResource.fetch('app/scripts/services/FHIR/resources/Patient.json').then(function (fhirDoc) {
          var fhirObject = FHIR.mapFHIRObject(fhirDoc, scope.state.FormBuilderAddPatient, formFieldsValues)
          console.log(fhirObject)

          defer.resolve({ isValid: true, msg: 'Patient mapped to FHIR document!' })

          // TODO: API call to submit patient
        })

        return defer.promise
      }

      scope.state = {}
      scope.state.FormBuilderAddPatient = {
        name: 'AddPatient',
        displayType: 'tabs',
        globals: {
          viewModeOnly: false,
          showDraftSubmitButton: false,
          showReviewButton: false
        },
        sections: [],
        buttons: {
          submit: 'add patient'
        },
        submit: {
          execute: submit,
          params: []
        },
        saveAsDraft: false,
        AddPatient: {}
      }

      var addFunctionToField = function (formSection, fieldNameToMatch, fieldPathToFunction, functionToAttach) {
        // attach load functions to json config
        for (var r = 0; r < formSection.rows.length; r++) {
          var row = formSection.rows[r]
          for (var f = 0; f < row.fields.length; f++) {
            var field = row.fields[f]

            // match field - add function - Static match for now
            if (field.name === fieldNameToMatch) {
              var fieldPathArr = fieldPathToFunction.split('.')
              for (var i = 0; i < fieldPathArr.length; i++) {
                // last property
                if (i === fieldPathArr.length - 1) {
                  field[fieldPathArr[i]] = functionToAttach
                  return
                }
                field = field[fieldPathArr[i]]
              }
            }
          }
        }
      }

      var duplicateFieldValue = function (params) {
        var keys = Object.keys(params)
        var checkboxVal = keys[0]
        var masterField = keys[1]
        var duplicateField = keys[2]

        // if check value set - duplcicate
        if (params[checkboxVal]) {
          return params[masterField]
        } else {
          // not set and already has value - return same value
          if (params[duplicateField]) {
            return params[duplicateField]
          }
          return null
        }
      }

      var sections = []
      loadResource.fetch('app/scripts/directives/add-patient-form/forms/basic-info.json').then(function (basicInfo) {
        loadResource.fetch('app/scripts/directives/add-patient-form/forms/address-info.json').then(function (addressInfo) {
          addFunctionToField(addressInfo, 'postalAddressNoStreet', 'skipLogic.func.execute', duplicateFieldValue)
          addFunctionToField(addressInfo, 'postalAddressSuburb', 'skipLogic.func.execute', duplicateFieldValue)
          addFunctionToField(addressInfo, 'postalAddressProvince', 'skipLogic.func.execute', duplicateFieldValue)
          addFunctionToField(addressInfo, 'postalAddressPostalCode', 'skipLogic.func.execute', duplicateFieldValue)

          loadResource.fetch('app/scripts/directives/add-patient-form/forms/emergency-contact-info.json').then(function (emergencyContactInfo) {
            sections.push(basicInfo)
            sections.push(addressInfo)
            sections.push(emergencyContactInfo)

            scope.state.FormBuilderAddPatient.sections = sections
          })
        })
      })
    }
  }
}
