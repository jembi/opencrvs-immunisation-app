'use strict'

const tap = require('tap')

const mhdBuilder = require('../../app/scripts/modules/mhd-doc-builder')

tap.test('MHD document builder', { autoend: true }, (t) => {
  t.test('.returnResourceAsEntry', { autoend: true }, (t) => {
    t.test('should encapsulate resource as an entry with fullUrl property', (t) => {
      var result = mhdBuilder.returnResourceAsEntry({ resourceType: 'Test' })
      t.same(result.resource, { resourceType: 'Test' })
      t.ok(result.fullUrl)
      t.end()
    })

    t.test('should add transaction properties', (t) => {
      var result = mhdBuilder.returnResourceAsEntry({ resourceType: 'Test' }, true)
      t.ok(result.request)
      t.equals(result.request.method, 'POST')
      t.equals(result.request.url, 'Test')
      t.end()
    })
  })

  t.test('.createDocumentBundle', { autoend: true }, (t) => {
    t.test('should produce a document bundle', (t) => {
      const docBundle = mhdBuilder.createDocumentBundle('Patient/test', [ { main: { test: 'event' } } ])
      t.ok(docBundle)
      t.equals(docBundle.resourceType, 'Bundle')
      t.equals(docBundle.type, 'document')
      t.end()
    })

    t.test('should produce a composition resource in the first entry position', (t) => {
      const docBundle = mhdBuilder.createDocumentBundle('Patient/test', [ { main: { test: 'event' } } ])
      t.equals(docBundle.entry[0].resource.resourceType, 'Composition')
      t.end()
    })

    t.test('should add entries for each event', (t) => {
      const docBundle = mhdBuilder.createDocumentBundle('Patient/test', [ { main: { test1: 'event1' } }, { main: { test2: 'event2' } } ])
      t.equals(docBundle.entry.length, 3) // composition then two events
      t.same(docBundle.entry[1].resource, { test1: 'event1' })
      t.ok(docBundle.entry[1].fullUrl)
      t.same(docBundle.entry[2].resource, { test2: 'event2' })
      t.ok(docBundle.entry[2].fullUrl)
      t.end()
    })

    t.test('should resolve references in events dictionary', (t) => {
      const docBundle = mhdBuilder.createDocumentBundle('Patient/test', [
        {
          main: {
            test1: 'event1'
          },
          obs1: {
            test2: 'event2',
            encounter: {
              reference: '@main'
            }
          },
          obs2: {
            test2: 'event2',
            encounter: {
              reference: '@main'
            },
            nested: {
              observation: {
                reference: '@obs1'
              }
            }
          }
        }
      ])
      t.equals(docBundle.entry.length, 4) // composition then two events
      t.equals(docBundle.entry[2].resource.encounter.reference, docBundle.entry[1].fullUrl)
      t.equals(docBundle.entry[3].resource.encounter.reference, docBundle.entry[1].fullUrl)
      t.equals(docBundle.entry[3].resource.nested.observation.reference, docBundle.entry[2].fullUrl)
      t.end()
    })

    t.test('should resolve references in events dictionary', (t) => {
      try {
        mhdBuilder.createDocumentBundle('Patient/test', [
          {
            main: {
              test1: 'event1',
              encounter: {
                reference: '@unknown'
              }
            }
          }
        ])
      } catch (err) {
        t.ok(err)
        t.end()
      }
    })
  })

  t.test('.createBinaryResource', { autoend: true }, (t) => {
    t.test('should return a binary resource with base64 encoded content', (t) => {
      const binaryResource = mhdBuilder.createBinaryResource({ test: 'test' })
      t.equals(binaryResource.resourceType, 'Binary')
      t.equals(binaryResource.contentType, 'application/fhir+json')
      t.equals(binaryResource.content, 'eyJ0ZXN0IjoidGVzdCJ9')
      t.end()
    })
  })

  t.test('.createDocumentReference', { autoend: true }, (t) => {
    t.test('should return a documentReference with a attachment url linking to the binary entry', (t) => {
      const docRef = mhdBuilder.createDocumentReference('Patient/123', { fullUrl: 'urn:test:ng' })
      t.equals(docRef.resourceType, 'DocumentReference')
      t.equals(docRef.content.attachment.url, 'urn:test:ng')
      t.end()
    })
  })

  t.test('.createDocumentManifest', { autoend: true }, (t) => {
    t.test('should return a document manifest with content reference to the document reference', (t) => {
      const docManifest = mhdBuilder.createDocumentManifest('Patient/123', { fullUrl: 'urn:test:ng' })
      t.equals(docManifest.resourceType, 'DocumentManifest')
      t.equals(docManifest.content[0].pReference.reference, 'urn:test:ng')
      t.end()
    })
  })

  t.test('.buildMHDPayload', { autoend: true }, (t) => {
    t.test('should return a transaction bundle with 3 entries', (t) => {
      const mhdTransaction = mhdBuilder.buildMHDTransaction('Patient/test', [ { test: 'event' } ])
      t.ok(mhdTransaction)
      t.equals(mhdTransaction.resourceType, 'Bundle')
      t.equals(mhdTransaction.type, 'transaction')
      t.equals(mhdTransaction.entry.length, 3)
      mhdTransaction.entry.forEach((entry) => {
        t.ok(entry)
      })
      t.end()
    })
  })
})
