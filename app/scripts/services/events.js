'use strict'

module.exports = function () {
  const isHIVEncounter = (event) => {
    return event.resourceType &&
      event.resourceType === 'Encounter' &&
      event.class &&
      event.class.system &&
      event.class.system === 'http://hl7.org/fhir/v3/ActCode' &&
      event.class.code &&
      event.class.code === 'HIVAIDS'
  }

  const isEventOfType = (eventTypeCode, event) => {
    return isHIVEncounter(event) &&
      event.type &&
      Array.isArray(event.type) &&
      event.type.some((typeElem) => {
        return typeElem.coding &&
          Array.isArray(typeElem.coding) &&
          typeElem.coding.some((codingElem) => {
            return codingElem.system &&
              codingElem.system === 'http://hearth.org/cbs/event-types' &&
              codingElem.code &&
              codingElem.code === eventTypeCode
          })
      })
  }

  return {
    test: () => {
      console.log('Event service test')
    },

    isEventOfType: isEventOfType,

    formatEvents: (events) => {
      events.forEach((event) => {
        if (isEventOfType('linkage-to-care', event)) {
          // call format function
        } else if (isEventOfType('hiv-confirmation', event)) {
          // call format function
        } else if (isEventOfType('cd4-count', event)) {
          // call format function
        } else if (isEventOfType('viral-load', event)) {
          // call format function
        } else {
          console.error('Unknown event type found', event)
        }
      })
      return events
    }
  }
}
