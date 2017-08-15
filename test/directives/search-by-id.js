'use strict'

const tap = require('tap')
const sinon = require('sinon')

const searchById = require('../../app/scripts/directives/search-by-id')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.FormBuilderSearchById on scope and fetch correct form file', (t) => {
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
    t.ok(scope.state.FormBuilderSearchById)
    t.end()
  })

  tap.test('.submit()', { autoend: true }, (t) => {
    t.test('should resolve with a success message', (t) => {
      // given
      const scope = { $on: () => {} }
      const apiMock = {
        get: (params, success) => {
          success({ entry: [] })
        }
      }
      const fetchMock = (file) => {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
      const deferMock = () => {
        return {
          resolve: (result) => {
            t.equals(result.isValid, true)
            t.equals(result.msg, 'Search Successful')
            t.end()
          }
        }
      }
      const mock = () => {}
      const directive = searchById({ Patients: apiMock }, { fetch: fetchMock }, { defer: deferMock }, { setSearchResults: mock, setSearchType: mock })
      directive.link(scope)
      // when
      scope.state.FormBuilderSearchById.submit.execute()
    })

    t.test('should reject with an error message', (t) => {
      // given
      const scope = { $on: () => {} }
      const apiMock = {
        get: (params, success, error) => {
          const err = new Error()
          err.statusText = 'Internal server error mock'
          error(err)
        }
      }
      const fetchMock = (file) => {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
      const deferMock = () => {
        return {
          reject: (err) => {
            t.equals(err.isValid, false)
            t.equals(err.msg, 'Internal server error mock')
            t.end()
          }
        }
      }

      const directive = searchById({ Patients: apiMock }, { fetch: fetchMock }, { defer: deferMock })
      directive.link(scope)
      // when
      scope.state.FormBuilderSearchById.submit.execute()
    })

    t.test('should reject with a default error message when no statusText on error object', (t) => {
      // given
      const scope = { $on: () => {} }
      const apiMock = {
        get: (params, success, error) => {
          error(new Error())
        }
      }
      const fetchMock = (file) => {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
      const deferMock = () => {
        return {
          reject: (err) => {
            t.equals(err.isValid, false)
            t.equals(err.msg, 'Could not connect to server')
            t.end()
          }
        }
      }
      const directive = searchById({ Patients: apiMock }, { fetch: fetchMock }, { defer: deferMock })
      directive.link(scope)
      // when
      scope.state.FormBuilderSearchById.submit.execute()
    })

    t.test('should call the API with correct parameter', (t) => {
      // given
      const scope = { $on: () => {} }
      const apiMock = {
        get: (params, success, error) => {
          // then
          t.equals(params.identifier, '1234')
          success({ entry: [] })
        }
      }

      const fetchMock = (file) => {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
      const deferMock = () => {
        return {
          resolve: () => {
            t.end()
          }
        }
      }
      const mock = () => {}
      const directive = searchById({ Patients: apiMock }, { fetch: fetchMock }, { defer: deferMock }, { setSearchResults: mock, setSearchType: mock })
      directive.link(scope)
      // when
      scope.state.FormBuilderSearchById.submit.execute({ immunisationID: { $dirty: true, $modelValue: '1234' } })
    })
  })
})
