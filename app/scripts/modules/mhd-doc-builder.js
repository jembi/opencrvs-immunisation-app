'use strict'

var uuid = require('uuid')
var Base64 = require('js-base64').Base64

exports.returnResourceAsEntry = function (resource, isTransaction) {
  var entry = {
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

exports.createDocumentBundle = function (patientRef, eventResources, currentTime) {
  var doc = {
    resourceType: 'Bundle',
    type: 'document',
    meta: {
      lastUpdated: currentTime
    },
    entry: []
  }

  var composition = {
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

  var eventResourceEntries = []
  eventResources.forEach((event) => {
    var eventEntry = exports.returnResourceAsEntry(event)
    composition.resource.section.entry.push({
      title: 'CBS Event',
      text: 'CBS Event',
      reference: eventEntry.fullUrl
    })
    eventResourceEntries.push(eventEntry)
  })

  // composition must be at first position
  doc.entry[0] = composition

  doc.entry.push(...eventResourceEntries)

  return doc
}

exports.createBinaryResource = function (docBundle) {
  return {
    resourceType: 'Binary',
    contentType: 'application/fhir+json',
    content: Base64.encode(JSON.stringify(docBundle))
  }
}

exports.createDocumentReference = function (patientRef, binaryResourceEntry, currentTime) {
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

exports.createDocumentManifest = function (patientRef, docRefEntry, currentTime) {
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

exports.buildMHDTransaction = function (patientRef, events) {
  var currentTime = new Date()

  var docBundle = exports.createDocumentBundle(patientRef, events, currentTime)

  var binaryResource = exports.createBinaryResource(docBundle)
  var binaryResourceEntry = exports.returnResourceAsEntry(binaryResource, true)

  var docRef = exports.createDocumentReference(patientRef, binaryResourceEntry, currentTime)
  var docRefEntry = exports.returnResourceAsEntry(docRef, true)

  var docManifest = exports.createDocumentManifest(patientRef, docRefEntry, currentTime)
  var docManifestEntry = exports.returnResourceAsEntry(docManifest, true)

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
