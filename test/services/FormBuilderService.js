'use strict'

const tap = require('tap')
const sinon = require('sinon')

const FormBuilderService = require('../../app/scripts/services/FormBuilder.js')()

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

const testFormBuilderValues = function (t, valueShouldBeNull, formSchema) {
  for (var fbs = 0; fbs < formSchema.sections.length; fbs++) {
    var section = formSchema.sections[fbs]

    for (var fbr = 0; fbr < section.rows.length; fbr++) {
      var row = section.rows[fbr]

      for (var fbf = 0; fbf < row.fields.length; fbf++) {
        var field = row.fields[fbf]

        // if form has been reset, values should be null - notOk
        if (valueShouldBeNull) {
          t.notOk(field.value)
        } else {
          t.ok(field.value)
        }
      }
    }
  }
}

tap.test('.resetForm()', { autoend: true }, (t) => {
  t.test('should reset a FormBuilder form values', (t) => {
    const mockForm = {
      $setPristine: function () {},
      $setUntouched: function () {}
    }
    // given
    const FormBuilderSection = require('../resources/FormBuilder-sample-with-values.json')
    const FormBuilderInstance = {
      sections: [FormBuilderSection]
    }

    // ensure values are set in the FormBuilder schema - valueShouldBeNull = false
    testFormBuilderValues(t, false, FormBuilderInstance)

    // when
    FormBuilderService.resetForm(FormBuilderInstance, mockForm)

    // ensure values are set in the FormBuilder schema - valueShouldBeNull = false
    testFormBuilderValues(t, true, FormBuilderInstance)

    t.end()
  })
})
