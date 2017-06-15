'use strict'

const tap = require('tap')
const sinon = require('sinon')

const FHIR = require('../../app/scripts/services/FHIR/FHIR.js')()
const FormBuilderService = require('../../app/scripts/services/FormBuilder.js')()
const stateService = require('../../app/scripts/services/state.js')()
const addCbsEvent = require('../../app/scripts/directives/add-cbs-events/add-cbs-event')
const FormBuilderLinkageToCare = require('../../app/scripts/directives/add-cbs-events/add-cbs-event/forms/linkage-to-care.json')
const FormBuilderHIVConfirmation = require('../../app/scripts/directives/add-cbs-events/add-cbs-event/forms/hiv-confirmation.json')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.FormBuilderAddCbsEventLinkageToCare on scope and fetch correct form file', (t) => {
    // given
    const scope = {
      $watch: (args, callback) => { callback() },
      cbsEvent: { code: 'linkage-to-care', display: 'Linkage to care', formName: 'FormBuilderAddCbsEventLinkageToCare' }
    }
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/add-cbs-events/add-cbs-event/forms/linkage-to-care.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = addCbsEvent({ fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderAddCbsEventLinkageToCare)
    t.end()
  })

  t.test('should set state.FormBuilderAddCbsEventHIVConfirmation on scope and fetch correct form file', (t) => {
    // given
    const scope = {
      $watch: (args, callback) => { callback() },
      cbsEvent: { code: 'hiv-confirmation', display: 'HIV Confirmation', formName: 'FormBuilderAddCbsEventHIVConfirmation' }
    }
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/add-cbs-events/add-cbs-event/forms/hiv-confirmation.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = addCbsEvent({ fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderAddCbsEventHIVConfirmation)
    t.end()
  })
})

tap.test('.submit()', { autoend: true }, (t) => {
  t.test('state.FormBuilderAddCbsEventLinkageToCare should resolve with a success message', (t) => {
    // given
    const testSandbox = sinon.sandbox.create()
    testSandbox.spy(stateService, 'pushToEventsArray')

    const scope = {
      $watch: (args, callback) => { callback() },
      cbsEvent: { code: 'linkage-to-care', display: 'Linkage to care', formName: 'FormBuilderAddCbsEventLinkageToCare' },
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
        if (file === 'app/scripts/directives/add-cbs-events/add-cbs-event/forms/linkage-to-care.json') {
          const FormBuilderLinkageToCare = require('../../app/scripts/directives/add-cbs-events/add-cbs-event/forms/linkage-to-care.json')
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
          t.equals(result.isValid, true)
          t.equals(result.msg, 'Event has been successfully added for submission')

          t.equals(stateService.pushToEventsArray.getCall(0).args[0].resourceType, 'Encounter')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].period.start, '2017-02-23')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].location[0].location.display, 'Kacyiru Police Hospital')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].type[0].coding[0].display, 'pmtct-visit')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].subject.reference, 'Patient/AAAAA-BBBB-CCCC-DDDDD-EEEEEE')
          testSandbox.restore()
          t.end()
        }
      }
    }

    const directive = addCbsEvent({ fetch: fetchMock }, { defer: deferMock }, stateService, FHIR, FormBuilderService)
    directive.link(scope)
    // when
    scope.state.FormBuilderAddCbsEventLinkageToCare.sections = [FormBuilderLinkageToCare]
    scope.state.FormBuilderAddCbsEventLinkageToCare.submit.execute(mockFormData)
    // then
    t.ok(scope.state.FormBuilderAddCbsEventLinkageToCare)
  })

  t.test('state.FormBuilderAddCbsEventHIVConfirmation should resolve with a success message', (t) => {
    // given
    const testSandbox = sinon.sandbox.create()
    testSandbox.spy(stateService, 'pushToEventsArray')

    const scope = {
      $watch: (args, callback) => { callback() },
      cbsEvent: { code: 'hiv-confirmation', display: 'HIV Confirmation', formName: 'FormBuilderAddCbsEventHIVConfirmation' },
      patient: {
        resourceType: 'Patient',
        id: 'AAAAA-BBBB-CCCC-DDDDD-GG'
      }
    }
    const mockFormData = {
      $setPristine: function () {},
      $setUntouched: function () {},
      encounterDate: {
        $modelValue: '2017-01-01',
        $dirty: true
      },
      encounterLocation: {
        $modelValue: 'Chuk',
        $dirty: true
      },
      hivStatus: {
        $modelValue: 'Positive',
        $dirty: true
      },
      parnterHivStatus: {
        $modelValue: 'Negative',
        $dirty: true
      }
    }
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        if (file === 'app/scripts/directives/add-cbs-events/add-cbs-event/forms/hiv-confirmation.json') {
          const FormBuilderHIVConfirmation = require('../../app/scripts/directives/add-cbs-events/add-cbs-event/forms/hiv-confirmation.json')
          resolve(FormBuilderHIVConfirmation)
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
          t.equals(result.isValid, true)
          t.equals(result.msg, 'Event has been successfully added for submission')

          t.equals(stateService.pushToEventsArray.getCall(0).args[0].resourceType, 'Encounter')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].period.start, '2017-01-01')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].location[0].location.display, 'Chuk')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].subject.reference, 'Patient/AAAAA-BBBB-CCCC-DDDDD-GG')

          // TODO get below tests to pass
          // t.equals(stateService.pushToEventsArray.getCall(1).args[0].resourceType, 'Observation')
          // t.equals(stateService.pushToEventsArray.getCall(1).args[0].encounter.reference, 'Encounter/xxxx')
          // t.equals(stateService.pushToEventsArray.getCall(1).args[0].code.coding[0].display, 'Positive')
          //
          // t.equals(stateService.pushToEventsArray.getCall(2).args[0].resourceType, 'Observation')
          // t.equals(stateService.pushToEventsArray.getCall(2).args[0].encounter.reference, 'Encounter/xxxx')
          // t.equals(stateService.pushToEventsArray.getCall(2).args[0].code.coding[0].display, 'Negative')

          testSandbox.restore()
          t.end()
        }
      }
    }

    const directive = addCbsEvent({ fetch: fetchMock }, { defer: deferMock }, stateService, FHIR, FormBuilderService)
    directive.link(scope)
    // when
    scope.state.FormBuilderAddCbsEventHIVConfirmation.sections = [FormBuilderHIVConfirmation]
    scope.state.FormBuilderAddCbsEventHIVConfirmation.submit.execute(mockFormData)
    // then
    t.ok(scope.state.FormBuilderAddCbsEventHIVConfirmation)
  })
})
