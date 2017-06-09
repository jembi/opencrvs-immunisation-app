'use strict'

const tap = require('tap')
const sinon = require('sinon')

const searchByDemographics = require('../../app/scripts/directives/search-by-demographics')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.FormBuilderDemographics on scope and fetch correct form file', (t) => {
    // given
    const scope = {}
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/search-by-demographics/form.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = searchByDemographics({ Patients: { match: () => {} } }, { fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderDemographics)
    t.end()
  })

  tap.test('.submit()', { autoend: true }, (t) => {
    t.test('should resolve with a success message', (t) => {
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
            // then
            t.equals(result.isValid, true)
            t.equals(result.msg, 'Search Successful')
            t.end()
          }
        }
      }
      const matchMock = (body, success) => {
        success({ entry: [] })
      }
      const stateMock = {
        setSearchResults: () => {},
        setPartialPatientDemographics: () => {},
        setSearchType: () => {}
      }
      const directive = searchByDemographics({ Patients: { match: matchMock } }, { fetch: fetchMock }, { defer: deferMock }, stateMock)
      directive.link(scope)
      // when
      scope.state.FormBuilderDemographics.submit.execute()
    })

    t.test('should call Api.match with a FHIR parameter object', (t) => {
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
            t.end()
          }
        }
      }
      const matchMock = (body, success) => {
        // then
        t.deepEquals(body, {
          resourceType: 'Parameters',
          parameter: [
            {
              name: 'resource',
              resource: {
                resourceType: 'Patient',
                name: [
                  {
                    given: [ 'Jane' ],
                    family: [ 'Smith' ]
                  }
                ],
                gender: 'female',
                birthDate: '1986-05-31'
              }
            },
            {
              name: 'count',
              valueInteger: 100
            },
            {
              name: 'onlyCertainMatches',
              valueBoolean: false
            }
          ]
        })
        success({ entry: [] })
      }
      const stateMock = {
        setSearchResults: () => {},
        setPartialPatientDemographics: () => {},
        setSearchType: () => {}
      }
      const directive = searchByDemographics({ Patients: { match: matchMock } }, { fetch: fetchMock }, { defer: deferMock }, stateMock)
      directive.link(scope)
      // when
      scope.state.FormBuilderDemographics.submit.execute({
        givenName: { $dirty: true, $modelValue: 'Jane' },
        familyName: { $dirty: true, $modelValue: 'Smith' },
        gender: { $dirty: true, $modelValue: 'female' },
        birthDate: { $dirty: true, $modelValue: '1986-05-31T08:13:15.421Z' }
      })
    })

    t.test('should set results on the state service', (t) => {
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
            t.end()
          }
        }
      }
      const matchMock = (body, success) => {
        success({ entry: [ 'one', 'two' ] })
      }
      const stateMock = {
        setSearchResults: (results) => {
          t.deepEquals(results, [ 'one', 'two' ])
        },
        setPartialPatientDemographics: () => {},
        setSearchType: () => {}
      }
      const directive = searchByDemographics({ Patients: { match: matchMock } }, { fetch: fetchMock }, { defer: deferMock }, stateMock)
      directive.link(scope)
      // when
      scope.state.FormBuilderDemographics.submit.execute()
    })

    t.test('should reject submit promise if an error occurs with statusText Property', (t) => {
      // given
      const scope = {}
      const fetchMock = (file) => {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
      const deferMock = () => {
        return {
          reject: (err) => {
            t.equals(err.isValid, false)
            t.equals(err.msg, 'Internal Server Error')
            t.end()
          }
        }
      }
      const matchMock = (body, success, error) => {
        error({ statusText: 'Internal Server Error' })
      }
      const directive = searchByDemographics({ Patients: { match: matchMock } }, { fetch: fetchMock }, { defer: deferMock }, { setPartialPatientDemographics: () => {} })
      directive.link(scope)
      // when
      scope.state.FormBuilderDemographics.submit.execute()
    })

    t.test('should reject submit promise if an unexpected error occurs', (t) => {
      // given
      const scope = {}
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
      const matchMock = (body, success, error) => {
        error(new Error('I failed :('))
      }
      const directive = searchByDemographics({ Patients: { match: matchMock } }, { fetch: fetchMock }, { defer: deferMock }, { setPartialPatientDemographics: () => {} })
      directive.link(scope)
      // when
      scope.state.FormBuilderDemographics.submit.execute()
    })
  })
})
