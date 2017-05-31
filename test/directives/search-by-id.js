'use strict'

const tap = require('tap')
const sinon = require('sinon')

const searchById = require('../../app/scripts/directives/search-by-id')

tap.test('.link()', { autoend: true }, (t) => {
  const sandbox = sinon.sandbox.create()
  tap.beforeEach((done) => {
    sandbox.stub(console, 'error').callsFake((msg) => {})
    done()
  })

  tap.afterEach((done) => {
    sandbox.restore()
    done()
  })

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
    const apiMock = {
      get: (id) => {
        return {
          $promise: new Promise((resolve, reject) => {
            resolve()
          })
        }
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
          t.equals(result.msg, 'Success')
          t.end()
        }
      }
    }
    const directive = searchById({ Patients: apiMock }, { fetch: fetchMock }, { defer: deferMock })
    directive.link(scope)
    // when
    scope.state.FormBuilder.submit.execute()
  })

  t.test('.submit() - should reject with an error message', (t) => {
    // given
    const scope = {}
    const apiMock = {
      get: (id) => {
        return {
          $promise: new Promise((resolve, reject) => {
            const error = new Error()
            error.statusText = 'Internal server error mock'
            reject(error)
          })
        }
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
    scope.state.FormBuilder.submit.execute()
  })

  t.test('.submit() - should reject with a default error message when no statusText on error object', (t) => {
    // given
    const scope = {}
    const apiMock = {
      get: (id) => {
        return {
          $promise: new Promise((resolve, reject) => {
            reject(new Error())
          })
        }
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
          t.equals(err.msg, 'Failed to perform search')
          t.end()
        }
      }
    }
    const directive = searchById({ Patients: apiMock }, { fetch: fetchMock }, { defer: deferMock })
    directive.link(scope)
    // when
    scope.state.FormBuilder.submit.execute()
  })
})
