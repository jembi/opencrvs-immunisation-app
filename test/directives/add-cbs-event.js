'use strict'

const tap = require('tap')
const sinon = require('sinon')

const FHIR = require('../../app/scripts/services/FHIR/FHIR.js')()
const FormBuilderService = require('../../app/scripts/services/FormBuilder.js')()
const stateService = require('../../app/scripts/services/state.js')()
const addEvent = require('../../app/scripts/directives/add-events/add-event')
const FormBuilderLinkageToCare = require('../../app/scripts/directives/add-events/add-event/forms/linkage-to-care.json')
const FormBuilderHIVConfirmation = require('../../app/scripts/directives/add-events/add-event/forms/hiv-confirmation.json')
const FormBuilderCD4Count = require('../../app/scripts/directives/add-events/add-event/forms/cd4-count.json')
const FormBuilderViralLoad = require('../../app/scripts/directives/add-events/add-event/forms/viral-load.json')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('should set state.FormBuilderaddEventLinkageToCare on scope and fetch correct form file', (t) => {
    // given
    const scope = {
      $watch: (args, callback) => { callback() },
      event: { code: 'linkage-to-care', display: 'Linkage to care', formName: 'FormBuilderaddEventLinkageToCare' }
    }
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/add-events/add-event/forms/linkage-to-care.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = addEvent({ fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderaddEventLinkageToCare)
    t.end()
  })

  t.test('should set state.FormBuilderaddEventHIVConfirmation on scope and fetch correct form file', (t) => {
    // given
    const scope = {
      $watch: (args, callback) => { callback() },
      event: { code: 'hiv-confirmation', display: 'HIV Confirmation', formName: 'FormBuilderaddEventHIVConfirmation' }
    }
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/add-events/add-event/forms/hiv-confirmation.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = addEvent({ fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderaddEventHIVConfirmation)
    t.end()
  })

  t.test('should set state.FormBuilderaddEventCD4Count on scope and fetch correct form file', (t) => {
    // given
    const scope = {
      $watch: (args, callback) => { callback() },
      event: { code: 'cd4-count', display: 'CD4 Count', formName: 'FormBuilderaddEventCD4Count' }
    }
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/add-events/add-event/forms/cd4-count.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = addEvent({ fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderaddEventCD4Count)
    t.end()
  })

  t.test('should set state.FormBuilderaddEventViralLoad on scope and fetch correct form file', (t) => {
    // given
    const scope = {
      $watch: (args, callback) => { callback() },
      event: { code: 'viral-load', display: 'Viral Load', formName: 'FormBuilderaddEventViralLoad' }
    }
    const fetchMock = (file) => {
      t.equals(file, 'app/scripts/directives/add-events/add-event/forms/viral-load.json')
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    const directive = addEvent({ fetch: fetchMock })
    // when
    directive.link(scope)
    // then
    t.ok(scope.state.FormBuilderaddEventViralLoad)
    t.end()
  })
})

tap.test('.submit()', { autoend: true }, (t) => {
  t.test('state.FormBuilderaddEventLinkageToCare should resolve with a success message', (t) => {
    // given
    const testSandbox = sinon.sandbox.create()
    testSandbox.spy(stateService, 'pushToEventsArray')

    const scope = {
      $watch: (args, callback) => { callback() },
      event: { code: 'linkage-to-care', display: 'Linkage to care', formName: 'FormBuilderaddEventLinkageToCare' },
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
        if (file === 'app/scripts/directives/add-events/add-event/forms/linkage-to-care.json') {
          const FormBuilderLinkageToCare = require('../../app/scripts/directives/add-events/add-event/forms/linkage-to-care.json')
          resolve(FormBuilderLinkageToCare)
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
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.type[0].coding[0].display, 'Linkage to Care')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.type[0].coding[0].code, 'linkage-to-care')
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
    scope.state.FormBuilderaddEventLinkageToCare.sections = [FormBuilderLinkageToCare]
    scope.state.FormBuilderaddEventLinkageToCare.submit.execute(mockFormData)
    // then
    t.ok(scope.state.FormBuilderaddEventLinkageToCare)
  })

  t.test('state.FormBuilderaddEventHIVConfirmation should resolve with a success message', (t) => {
    // given
    const testSandbox = sinon.sandbox.create()
    testSandbox.spy(stateService, 'pushToEventsArray')

    const scope = {
      $watch: (args, callback) => { callback() },
      event: { code: 'hiv-confirmation', display: 'HIV Confirmation', formName: 'FormBuilderaddEventHIVConfirmation' },
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
      subjectHIVStatus: {
        $modelValue: 'positive',
        $dirty: true
      },
      partnerHivStatus: {
        $modelValue: 'negative',
        $dirty: true
      }
    }
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        if (file === 'app/scripts/directives/add-events/add-event/forms/hiv-confirmation.json') {
          const FormBuilderHIVConfirmation = require('../../app/scripts/directives/add-events/add-event/forms/hiv-confirmation.json')
          resolve(FormBuilderHIVConfirmation)
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

          // Encounter
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.resourceType, 'Encounter')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.period.start, '2017-01-01')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.location[0].location.display, 'Chuk')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.patient.reference, 'Patient/AAAAA-BBBB-CCCC-DDDDD-GG')

          // Patient HIV Observation
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].subjectHIVObs.resourceType, 'Observation')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].subjectHIVObs.encounter.reference, '@main')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].subjectHIVObs.code.coding[0].code, '33660-2')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].subjectHIVObs.code.coding[0].system, 'http://loinc.org')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].subjectHIVObs.valueCodeableConcept.coding.system, 'http://loinc.org')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].subjectHIVObs.valueCodeableConcept.coding.code, 'LA6576-8')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].subjectHIVObs.valueCodeableConcept.text, 'Positive')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].subjectHIVObs.effectiveDateTime, '2017-01-01')

          // Partner HIV Observation
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].partnerHIVObs.resourceType, 'Observation')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].partnerHIVObs.encounter.reference, '@main')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].partnerHIVObs.code.coding[0].code, 'partner-hiv-status')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].partnerHIVObs.code.coding[0].system, 'http://hearth.org/cbs/observation-types')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].partnerHIVObs.valueCodeableConcept.coding.system, 'http://loinc.org')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].partnerHIVObs.valueCodeableConcept.coding.code, 'LA6576-8')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].partnerHIVObs.valueCodeableConcept.text, 'Negative')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].partnerHIVObs.effectiveDateTime, '2017-01-01')

          testSandbox.restore()
          t.end()
        }
      }
    }

    const directive = addEvent({ fetch: fetchMock }, { defer: deferMock }, stateService, FHIR, FormBuilderService)
    directive.link(scope)
    // when
    scope.state.FormBuilderaddEventHIVConfirmation.sections = [FormBuilderHIVConfirmation]
    scope.state.FormBuilderaddEventHIVConfirmation.submit.execute(mockFormData)
    // then
    t.ok(scope.state.FormBuilderaddEventHIVConfirmation)
  })

  t.test('state.FormBuilderaddEventCD4Count should resolve with a success message', (t) => {
    // given
    const testSandbox = sinon.sandbox.create()
    testSandbox.spy(stateService, 'pushToEventsArray')

    const scope = {
      $watch: (args, callback) => { callback() },
      event: { code: 'cd4-count', display: 'CD4 Count', formName: 'FormBuilderaddEventCD4Count' },
      patient: {
        resourceType: 'Patient',
        id: 'AAAAA-BBBB-CCCC-DDDDD-CC'
      }
    }
    const mockFormData = {
      $setPristine: function () {},
      $setUntouched: function () {},
      dateOfExam: {
        $modelValue: '2017-02-02',
        $dirty: true
      },
      location: {
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
        if (file === 'app/scripts/directives/add-events/add-event/forms/cd4-count.json') {
          const FormBuilderCD4Count = require('../../app/scripts/directives/add-events/add-event/forms/cd4-count.json')
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
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].main.patient.reference, 'Patient/AAAAA-BBBB-CCCC-DDDDD-CC')

          // Observation resource
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.resourceType, 'Observation')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.encounter.reference, '@main')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.effectiveDateTime, '2017-02-02')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.contained[0].name[0].given[0], 'GivenNamey')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.contained[0].name[0].family[0], 'FamilyNamey')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.contained[0].id, 'provider-1')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.performer[0].reference, '#provider-1')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.valueQuantity.unit, 'copies/mL')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].cd4CountObs.valueQuantity.value, 'Example CD4 Count Result')

          testSandbox.restore()
          t.end()
        }
      }
    }

    const directive = addEvent({ fetch: fetchMock }, { defer: deferMock }, stateService, FHIR, FormBuilderService)
    directive.link(scope)
    // when
    scope.state.FormBuilderaddEventCD4Count.sections = [FormBuilderCD4Count]
    scope.state.FormBuilderaddEventCD4Count.submit.execute(mockFormData)
    // then
    t.ok(scope.state.FormBuilderaddEventCD4Count)
  })

  t.test('state.FormBuilderaddEventViralLoad should resolve with a success message', (t) => {
    // given
    const testSandbox = sinon.sandbox.create()
    testSandbox.spy(stateService, 'pushToEventsArray')

    const scope = {
      $watch: (args, callback) => { callback() },
      event: { code: 'viral-load', display: 'Viral Load', formName: 'FormBuilderaddEventViralLoad' },
      patient: {
        resourceType: 'Patient',
        id: 'AAAAA-BBBB-CCCC-DDDDD-AA'
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
      viralLoadResult: {
        $modelValue: 'Example Viral Load Result',
        $dirty: true
      }
    }
    const fetchMock = (file) => {
      return new Promise((resolve, reject) => {
        if (file === 'app/scripts/directives/add-events/add-event/forms/viral-load.json') {
          const FormBuilderViralLoad = require('../../app/scripts/directives/add-events/add-event/forms/viral-load.json')
          resolve(FormBuilderViralLoad)
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
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].viralLoadObs.resourceType, 'Observation')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].viralLoadObs.encounter.reference, '@main')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].viralLoadObs.effectiveDateTime, '2017-02-02')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].viralLoadObs.contained[0].name[0].given[0], 'GivenNamey')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].viralLoadObs.contained[0].name[0].family[0], 'FamilyNamey')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].viralLoadObs.contained[0].id, 'provider-1')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].viralLoadObs.performer[0].reference, '#provider-1')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].viralLoadObs.valueQuantity.unit, 'copies/mL')
          t.equals(stateService.pushToEventsArray.getCall(0).args[0].viralLoadObs.valueQuantity.value, 'Example Viral Load Result')

          testSandbox.restore()
          t.end()
        }
      }
    }

    const directive = addEvent({ fetch: fetchMock }, { defer: deferMock }, stateService, FHIR, FormBuilderService)
    directive.link(scope)
    // when
    scope.state.FormBuilderaddEventViralLoad.sections = [FormBuilderViralLoad]
    scope.state.FormBuilderaddEventViralLoad.submit.execute(mockFormData)
    // then
    t.ok(scope.state.FormBuilderaddEventViralLoad)
  })
})
