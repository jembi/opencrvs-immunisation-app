'use strict'

const tap = require('tap')
const sinon = require('sinon')

const FHIR = require('../../app/scripts/services/FHIR/FHIR.js')()
const linkageToCare = require('../../app/scripts/directives/add-cbs-events/linkage-to-care')
const FormBuilderLinkageToCare = require('../../app/scripts/directives/add-cbs-events/linkage-to-care/form.json')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.FormBuilderAddCbsEventLinkageToCare on scope and fetch correct form file', (t) => {
    // given
    const scope = {}
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/add-cbs-events/linkage-to-care/form.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = linkageToCare({ Patients: { match: () => {} } }, { fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderAddCbsEventLinkageToCare)
    t.end()
  })
})

tap.test('.submit()', { autoend: true }, (t) => {
  t.test('should resolve with a success message', (t) => {
    // given
    const scope = {}
    const mockFormData = {
      encounterDate: {
        $modelValue: '2017-02-23',
        $dirty: true
      },
      encounterLocation: {
        $modelValue: 'Kacyiru Police Hospital',
        $dirty: true
      },
      encounterType: {
        $modelValue: 'pmtct-visit',
        $dirty: true
      }
    }
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        if (file === 'app/scripts/directives/add-cbs-events/linkage-to-care/form.json') {
          const FormBuilderLinkageToCare = require('../../app/scripts/directives/add-cbs-events/linkage-to-care/form.json')
          resolve(FormBuilderLinkageToCare)
        } else if (file === 'app/scripts/services/FHIR/resources/Encounter.json') {
          const FHIREncounterResource = require('../../app/scripts/services/FHIR/resources/Encounter.json')
          resolve(FHIREncounterResource)
        }
      })
    }
    const deferMock = () => {
      return {
        resolve: (result) => {
          // then
          // TODO: Used in API call
          t.equals(result.isValid, true)
          t.equals(result.msg, 'Event mapped to FHIR document!')
          t.end()
        }
      }
    }

    const directive = linkageToCare({}, { fetch: fetchMock }, { defer: deferMock }, {}, FHIR)
    directive.link(scope)
    // when
    scope.state.FormBuilderAddCbsEventLinkageToCare.sections = [FormBuilderLinkageToCare]
    scope.state.FormBuilderAddCbsEventLinkageToCare.submit.execute(mockFormData)
    // then
    t.ok(scope.state.FormBuilderAddCbsEventLinkageToCare)
  })
})
