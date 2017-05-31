'use strict'

const tap = require('tap')

const searchById = require('../../app/scripts/directives/search-by-id')

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.FormBuilderSearchById on scope and fetch correct form file', (t) => {
    // given
    const scope = {
      state: {}
    }
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
    t.ok(scope.state.FormBuilderSearchById)
    t.end()
  })

  t.test('.submit() - should resolve with a success message', (t) => {
    // given
    const scope = {
      state: {}
    }
    const fetchMock = (file) => {
      // TODO: Remove if condition: A mocked request is in place, this will be removed once the mocked response is replaced with API call
      if (file === 'app/scripts/directives/patients-list/sample-result.json') {
        return new Promise((resolve, reject) => {
          resolve([{}, {}, {}, {}])
        })
      } else {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
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
    scope.state.FormBuilderSearchById.submit.execute()
  })
})
