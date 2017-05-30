'use strict'

const tap = require('tap')

const searchById = require('../../app/scripts/directives/search-by-id')

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.fromBuilder on scope and fetch correct form file', (t) => {
    // given
    const scope = {}
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/search-by-id/form.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = searchById({}, { fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilder)
    t.end()
  })

  t.test('.submit() - should resolve with a success message', (t) => {
    // given
    const scope = {}
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const deferMock = () => {
      return {
        resolve: (result) => {
          t.equals(result.isValid, true)
          t.equals(result.msg, 'Success')
          t.end()
        }
      }
    }
    const directive = searchById({}, { fetch: fetchMock }, { defer: deferMock })
    directive.link(scope)
    // when
    scope.state.FormBuilder.submit.execute()
  })
})
