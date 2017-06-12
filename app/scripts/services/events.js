'use strict'

module.exports = function () {
  const isHIVConfirmation = (event) => {
    return event.resourceType &&
      event.resourceType === 'Observation' &&
      event.code &&
      event.code.coding &&
      event.code.coding.system &&
      event.code.coding.system === 'http://loinc.org' &&
      event.code.coding.code &&
      event.code.coding.code === '33660-2'
  }

  const isLinkageToCare = (event) => {
    return event.resourceType &&
      event.resourceType === 'Encounter' &&
      event.class &&
      event.class &&
      event.class.system &&
      event.class.system === 'http://hl7.org/fhir/v3/ActCode' &&
      event.class.code &&
      event.class.code === 'HIVAIDS'
  }

  const isCD4Count = (event) => {
    return event.resourceType &&
      event.resourceType === 'Observation' &&
      event.code &&
      event.code.coding &&
      event.code.coding.system &&
      event.code.coding.system === 'http://loinc.org' &&
      event.code.coding.code &&
      event.code.coding.code === '24467-3'
  }

  const isViralLoad = (event) => {
    return event.resourceType &&
      event.resourceType === 'Observation' &&
      event.code &&
      event.code.coding &&
      event.code.coding.system &&
      event.code.coding.system === 'http://loinc.org' &&
      event.code.coding.code &&
      event.code.coding.code === '23876-6'
  }

  return {
    test: () => {
      console.log('Event service test')
    },

    isHIVConfirmation: isHIVConfirmation,
    isLinkageToCare: isLinkageToCare,
    isCD4Count: isCD4Count,
    isViralLoad: isViralLoad,

    formatEvents: (events) => {
      events.forEach((event) => {
        if (isHIVConfirmation(event)) {
          // call format function
        } else if (isLinkageToCare(event)) {
          // call format function
        } else if (isCD4Count(event)) {
          // call format function
        } else if (isViralLoad(event)) {
          // call format function
        } else {
          console.error('Unknown event type found', event)
        }
      })
      return events
    }
  }
}
