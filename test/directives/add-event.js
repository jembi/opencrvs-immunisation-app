'use strict'

const tap = require('tap')
const sinon = require('sinon')

const FHIR = require('../../app/scripts/services/FHIR/FHIR.js')()
const FormBuilderService = require('../../app/scripts/services/FormBuilder.js')()
const stateService = require('../../app/scripts/services/state.js')()
const addEvent = require('../../app/scripts/directives/add-events/add-event')
const FormBuilderAddEventSampleEvent = require('../../app/scripts/directives/add-events/add-event/forms/sample-event.json')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.FormBuilderAddEventSampleEvent on scope and fetch correct form file', (t) => {
    // given
    const scope = {
      $watch: (args, callback) => { callback() },
      event: { code: 'sample-event', display: 'Sample Event', formName: 'FormBuilderAddEventSampleEvent' }
    }
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/add-events/add-event/forms/sample-event.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = addEvent({ fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderAddEventSampleEvent)
    t.end()
  })
})

tap.test('.submit()', { autoend: true }, (t) => {
  t.test('state.FormBuilderAddEventSampleEvent should resolve with a success message', (t) => {
    // given
    const testSandbox = sinon.sandbox.create()
    testSandbox.spy(stateService, 'pushToEventsArray')

    const scope = {
      $watch: (args, callback) => { callback() },
      event: { code: 'sample-event', display: 'Sample Event', formName: 'FormBuilderAddEventSampleEvent' },
      patient: {
        resourceType: 'Patient',
        id: 'AAAAA-BBBB-CCCC-DDDDD-EEEEEE'
      }
    }
    const mockFormData = {
      $setPristine: function () {},
      $setUntouched: function () {},
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
        if (file === 'app/scripts/directives/add-events/add-event/forms/sample-event.json') {
          const FormBuilderAddEventSampleEvent = require('../../app/scripts/directives/add-events/add-event/forms/sample-event.json')
          resolve(FormBuilderAddEventSampleEvent)
        } else if (file === 'app/scripts/services/FHIR/resources/Encounter.json') {
          const FHIREncounterResource = require('../../app/scripts/services/FHIR/resources/Encounter.json')
          resolve(FHIREncounterResource)
        } else if (file === 'app/scripts/services/FHIR/resources/Observation.json') {
          const FHIRObservationResource = require('../../app/scripts/services/FHIR/resources/Observation.json')
          resolve(FHIRObservationResource)
        }
      })
    }
    const deferMock = () => {
      return {
        resolve: (result) => {
          // then
          t.equals(result.isValid, true)
          t.equals(result.msg, 'Event has been successfully added for submission')

          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.resourceType, 'Encounter')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.period.start, '2017-02-23')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.location[0].location.display, 'Kacyiru Police Hospital')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.type[0].coding[0].display, 'Sample Event')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.type[0].coding[0].code, 'sample-event')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.type[1].coding[0].display, 'PMTCT visit')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.type[1].coding[0].code, 'pmtct-visit')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.patient.reference, 'Patient/AAAAA-BBBB-CCCC-DDDDD-EEEEEE')
          testSandbox.restore()
          t.end()
        }
      }
    }

    const directive = addEvent({ fetch: fetchMock }, { defer: deferMock }, stateService, FHIR, FormBuilderService)
    directive.link(scope)
    // when
    scope.state.FormBuilderAddEventSampleEvent.sections = [FormBuilderAddEventSampleEvent]
    scope.state.FormBuilderAddEventSampleEvent.submit.execute(mockFormData)
    // then
    t.ok(scope.state.FormBuilderAddEventSampleEvent)
  })
})
