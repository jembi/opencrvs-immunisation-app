'use strict'

const tap = require('tap')
const sinon = require('sinon')

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.link()', { autoend: true }, (t) => {
  t.end()
})

tap.test('.submit()', { autoend: true }, (t) => {
  t.end()
})
