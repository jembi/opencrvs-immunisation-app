'use strict'

module.exports = function () {
  return {
    resetForm: function (formSchema, form) {
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
    },

    getFormFieldValues: (form) => {
      var formFieldsValues = {}
      for (var k in form) {
        if (form.hasOwnProperty(k)) {
          if (typeof form[k] === 'object' && form[k].hasOwnProperty('$modelValue')) {
            formFieldsValues[k] = form[k].$modelValue
          }
        }
      }

      return formFieldsValues
    }
  }
}
