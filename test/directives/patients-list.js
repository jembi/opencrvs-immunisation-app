'use strict'

const tap = require('tap')
const sinon = require('sinon')

const patientsList = require('../../app/scripts/directives/patients-list')
const matchingResult = require('../resources/matching-resultset.json')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should load the patients-list directive, and should not have a patients array - empty results', (t) => {
    // given
    const scope = {
      results: [],
      $watch: () => {
        // no results - nothing changes
      }
    }
    const mock = () => {}
    const directive = patientsList({}, { setSearchResults: mock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.results)
    t.notOk(scope.patients) // results array was empty
    t.end()
  })
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should load the patients-list directive, and should create a patients array', (t) => {
    // given
    const scope = {
      results: matchingResult.entry,
      $watch: () => {
        scope.createPatientsList(matchingResult.entry)
      }
    }
    const mock = () => {}
    const directive = patientsList({}, { setSearchResults: mock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.results)
    t.ok(scope.patients) // results array was empty
    t.equal(scope.patients.length, 2, 'should have two patients in the array')
    t.equal(scope.patients[0].name.given, 'Nelle', 'should patient 1 with given name of "Nelle"')
    t.equal(scope.patients[0].name.family, 'Burton', 'should patient 1 with family name of "Burton"')
    t.equal(scope.patients[1].name.given, 'Bertie', 'should patient 2 with given name of "Bertie"')
    t.end()
  })
})
