'use strict'

const tap = require('tap')
const sinon = require('sinon')

const UpdatePatientController = require('../../app/scripts/controllers/update-patient')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('should set an error message when api fails to respond', (t) => {
  // given
  const scopeMock = {}

  const routeParamsMock = {
    patientId: '1234'
  }

  const apiMock = {
    Patients: {
      get: (params, success, error) => {
        t.equal(params.id, '1234')
        error('Error')
      }
    }
  }
  // when
  UpdatePatientController(scopeMock, {}, routeParamsMock, {}, apiMock)

  // then
  t.equals(scopeMock.getPatientError, 'Error: Failed to find patient with id:1234')
  t.end()
})

tap.test('should set partial demographics to state on successful response from api', (t) => {
  // given
  const scopeMock = {}

  const routeParamsMock = {
    patientId: '1234'
  }

  const stateMock = {
    setPartialPatientDemographics: (patient) => {
      // then
      t.notOk(scopeMock.getPatientError)
      t.equal(scopeMock.partialDemographics.resourceType, 'Patient')
      t.equal(patient.resourceType, 'Patient')
      t.end()
    }
  }

  const apiMock = {
    Patients: {
      get: (params, success, error) => {
        t.equal(params.id, '1234')
        success({
          resourceType: 'Patient'
        })
      }
    }
  }
  // when
  UpdatePatientController(scopeMock, {}, routeParamsMock, stateMock, apiMock)
})

tap.test('should set an error if no patient returned by api', (t) => {
  // given
  const scopeMock = {}

  const routeParamsMock = {
    patientId: '1234'
  }

  const apiMock = {
    Patients: {
      get: (params, success, error) => {
        t.equal(params.id, '1234')
        success()
      }
    }
  }
  // when
  UpdatePatientController(scopeMock, {}, routeParamsMock, {}, apiMock)

  // then
  t.equals(scopeMock.getPatientError, 'Error: Failed to find patient with id:1234')
  t.end()
})
