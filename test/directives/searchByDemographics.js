'use strict'

const tap = require('tap')

const searchByDemographics = require('../../app/scripts/directives/search-by-demographics')

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.fromBuilder on scope and fetch correct form file', (t) => {
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
    t.ok(scope.state.FormBuilder)
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
            t.equals(result.msg, 'Found some potential matches')
            t.end()
          }
        }
      }
      const matchMock = (body, success) => {
        success({ entry: [] })
      }
      const mock = () => {}
      const directive = searchByDemographics({ Patients: { match: matchMock } }, { fetch: fetchMock }, { defer: deferMock }, { setSearchResults: mock })
      directive.link(scope)
      // when
      scope.state.FormBuilder.submit.execute()
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
                birthDate: '1986-05-31T08:13:15.421Z'
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
      const mock = () => {}
      const directive = searchByDemographics({ Patients: { match: matchMock } }, { fetch: fetchMock }, { defer: deferMock }, { setSearchResults: mock })
      directive.link(scope)
      // when
      scope.state.FormBuilder.submit.execute({
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
      const setSateMock = (results) => {
        t.deepEquals(results, [ 'one', 'two' ])
      }
      const directive = searchByDemographics({ Patients: { match: matchMock } }, { fetch: fetchMock }, { defer: deferMock }, { setSearchResults: setSateMock })
      directive.link(scope)
      // when
      scope.state.FormBuilder.submit.execute()
    })

    t.test('should reject submit promise if an error occurs', (t) => {
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
            t.equals(err.message, 'I failed :(')
            t.end()
          }
        }
      }
      const matchMock = (body, success, error) => {
        error(new Error('I failed :('))
      }
      const directive = searchByDemographics({ Patients: { match: matchMock } }, { fetch: fetchMock }, { defer: deferMock })
      directive.link(scope)
      // when
      scope.state.FormBuilder.submit.execute()
    })
  })
})