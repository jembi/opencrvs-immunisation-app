'use strict'

const uuid = require('uuid')
const Base64 = require('js-base64').Base64

exports.returnResourceAsEntry = (resource, isTransaction) => {
  const entry = {
    fullUrl: 'urn:uuid:' + uuid.v4(),
    resource: resource
  }

  if (isTransaction) {
    entry.request = {
      method: 'POST',
      url: resource.resourceType
    }
  }

  return entry
}

exports.createDocumentBundle = (patientRef, eventDictionaries, currentTime) => {
  const doc = {
    resourceType: 'Bundle',
    type: 'document',
    meta: {
      lastUpdated: currentTime
    },
    entry: []
  }

  const composition = {
    resource: {
      identifier: {
        system: 'urn:ietf:rfc:3986',
        value: uuid.v4()
      },
      resourceType: 'Composition',
      status: 'final',
      type: {
        coding: {
          system: 'http://hl7.org/fhir/ValueSet/c80-doc-typecodes',
          code: '74264-3'
        },
        text: 'HIV summary registry report Document'
      },
      class: {
        coding: {
          system: 'http://hl7.org/fhir/ValueSet/c80-doc-typecodes',
          code: '47045-0'
        },
        text: 'Study report Document'
      },
      subject: {
        reference: patientRef
      },
      date: currentTime,
      title: 'HIV case-based surveillance event report',
      section: {
        entry: []
      }
    }
  }

  const resourceEntries = []
  eventDictionaries.forEach((eventDict) => {
    Object.keys(eventDict).forEach((resourceKey) => {
      eventDict[resourceKey] = exports.returnResourceAsEntry(eventDict[resourceKey])
    })

    // resolveReferences(eventDict)

    Object.keys(eventDict).forEach((resourceKey) => {
      const resourceEntry = eventDict[resourceKey]
      resourceEntries.push(resourceEntry)

      if (resourceKey === 'main') {
        composition.resource.section.entry.push({
          title: 'CBS Event',
          text: 'CBS Event',
          reference: resourceEntry.fullUrl
        })
      }
    })
  })

  // composition must be at first position
  doc.entry[0] = composition

  doc.entry.push(...resourceEntries)

  return doc
}

exports.createBinaryResource = (docBundle) => {
  return {
    resourceType: 'Binary',
    contentType: 'application/fhir+json',
    content: Base64.encode(JSON.stringify(docBundle))
  }
}

exports.createDocumentReference = (patientRef, binaryResourceEntry, currentTime) => {
  return {
    resourceType: 'DocumentReference',
    masterIdentifier: {
      system: 'urn:ietf:rfc:3986',
      value: uuid.v4()
    },
    status: 'current',
    docStatus: 'final',
    type: {
      coding: {
        system: 'http://hl7.org/fhir/ValueSet/c80-doc-typecodes',
        code: '74264-3'
      },
      text: 'HIV summary registry report Document'
    },
    class: {
      coding: {
        system: 'http://hl7.org/fhir/ValueSet/c80-doc-typecodes',
        code: '47045-0'
      },
      text: 'Study report Document'
    },
    subject: {
      reference: patientRef
    },
    created: currentTime,
    indexed: currentTime,
    content: {
      attachment: {
        contentType: 'application/fhir+json',
        url: binaryResourceEntry.fullUrl,
        title: 'CBS event report',
        creation: currentTime
      }
    }
  }
}

exports.createDocumentManifest = (patientRef, docRefEntry, currentTime) => {
  return {
    resourceType: 'DocumentManifest',
    masterIdentifier: {
      system: 'urn:ietf:rfc:3986',
      value: uuid.v4()
    },
    status: 'current',
    type: {
      coding: {
        system: 'http://hl7.org/fhir/ValueSet/c80-doc-typecodes',
        code: '74264-3'
      },
      text: 'HIV summary registry report Document'
    },
    subject: {
      reference: patientRef
    },
    created: currentTime,
    source: 'urn:rcbs:mockupapp',
    content: [
      {
        pReference: {
          reference: docRefEntry.fullUrl
        }
      }
    ]
  }
}

/**
 * @param {String} patientRef - a FHIR patient reference
 * @param {Object} eventDictionaries - a dictionary where each key-value pair is
 * a resourceKey and a resource object. The main resource that all the others link
 * to must use a key of 'main', otherwise the keys can be anything you choose. If
 * the resources have references that you need to preserve, you can use the
 * key of the resource prefixed by an '@' to reference it in the resource object
 * itself. e.g. { ..., encounter: { reference: '@main' } }
 * @return {Object} a transaction bundle containing all events
 */
exports.buildMHDTransaction = (patientRef, eventDictionaries) => {
  const currentTime = new Date()

  const docBundle = exports.createDocumentBundle(patientRef, eventDictionaries, currentTime)

  const binaryResource = exports.createBinaryResource(docBundle)
  const binaryResourceEntry = exports.returnResourceAsEntry(binaryResource, true)

  const docRef = exports.createDocumentReference(patientRef, binaryResourceEntry, currentTime)
  const docRefEntry = exports.returnResourceAsEntry(docRef, true)

  const docManifest = exports.createDocumentManifest(patientRef, docRefEntry, currentTime)
  const docManifestEntry = exports.returnResourceAsEntry(docManifest, true)

  return {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: [
      binaryResourceEntry,
      docRefEntry,
      docManifestEntry
    ]
  }
}
