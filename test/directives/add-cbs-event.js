'use strict'

const tap = require('tap')
const sinon = require('sinon')

const FHIR = require('../../app/scripts/services/FHIR/FHIR.js')()
const FormBuilderService = require('../../app/scripts/services/FormBuilder.js')()
const stateService = require('../../app/scripts/services/state.js')()
const addCbsEvent = require('../../app/scripts/directives/add-cbs-events/add-cbs-event')
const FormBuilderLinkageToCare = require('../../app/scripts/directives/add-cbs-events/add-cbs-event/forms/linkage-to-care.json')
const FormBuilderCD4Count = require('../../app/scripts/directives/add-cbs-events/add-cbs-event/forms/cd4-count.json')

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

  t.test('should set state.FormBuilderAddCbsEventCD4Count on scope and fetch correct form file', (t) => {
    // given
    const scope = {
      $watch: (args, callback) => { callback() },
      cbsEvent: { code: 'cd4-count', display: 'CD4 Count', formName: 'FormBuilderAddCbsEventCD4Count' }
    }
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/add-cbs-events/add-cbs-event/forms/cd4-count.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = addCbsEvent({ fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderAddCbsEventCD4Count)
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
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].type[0].coding[0].display, 'PMTCT visit')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].type[0].coding[0].code, 'pmtct-visit')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].patient.reference, 'Patient/AAAAA-BBBB-CCCC-DDDDD-EEEEEE')
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

  t.test('state.FormBuilderAddCbsEventCD4Count should resolve with a success message', (t) => {
    // given
    const testSandbox = sinon.sandbox.create()
    testSandbox.spy(stateService, 'pushToEventsArray')

    const scope = {
      $watch: (args, callback) => { callback() },
      cbsEvent: { code: 'cd4-count', display: 'CD4 Count', formName: 'FormBuilderAddCbsEventCD4Count' },
      patient: {
        resourceType: 'Patient',
        id: 'AAAAA-BBBB-CCCC-DDDDD-BB'
      }
    }
    const mockFormData = {
      $setPristine: function () {},
      $setUntouched: function () {},
      encounterDate: {
        $modelValue: '2017-02-02',
        $dirty: true
      },
      encounterLocation: {
        $modelValue: 'Kacyiru Police Hospital',
        $dirty: true
      },
      providerGivenName: {
        $modelValue: 'GivenNamey',
        $dirty: true
      },
      providerFamilyName: {
        $modelValue: 'FamilyNamey',
        $dirty: true
      },
      cd4CountResult: {
        $modelValue: 'Example CD4 Count Result',
        $dirty: true
      }
    }
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        if (file === 'app/scripts/directives/add-cbs-events/add-cbs-event/forms/cd4-count.json') {
          const FormBuilderCD4Count = require('../../app/scripts/directives/add-cbs-events/add-cbs-event/forms/cd4-count.json')
          resolve(FormBuilderCD4Count)
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

          // Encounter resource
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.resourceType, 'Encounter')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.period.start, '2017-02-02')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.location[0].location.display, 'Kacyiru Police Hospital')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.patient.reference, 'Patient/AAAAA-BBBB-CCCC-DDDDD-AA')

          // Observation resource
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.resourceType, 'Observation')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.encounter.reference, '@main')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.effectiveDateTime, '2017-02-02')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.contained[0].name[0].given[0], 'GivenNamey')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.contained[0].name[0].family[0], 'FamilyNamey')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.contained[0].id, '#provider-1')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.performer[0].reference, 'provider-1')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.valueQuantity, 'Example CD4 Count Result')

          testSandbox.restore()
          t.end()
        }
      }
    }

    const directive = addCbsEvent({ fetch: fetchMock }, { defer: deferMock }, stateService, FHIR, FormBuilderService)
    directive.link(scope)
    // when
    scope.state.FormBuilderAddCbsEventCD4Counte.sections = [FormBuilderCD4Count]
    scope.state.FormBuilderAddCbsEventCD4Count.submit.execute(mockFormData)
    // then
    t.ok(scope.state.FormBuilderAddCbsEventCD4Count)
  })
})
