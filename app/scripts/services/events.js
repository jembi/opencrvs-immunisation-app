'use strict'

module.exports = function () {
  const HIV_CONFIRMATION = 'hiv-confirmation'

  return {
    sortEventsDesc: (events) => {
      return events.sort((a, b) => {
        if (!(a.eventDate instanceof Date)) { a.eventDate = new Date(a.eventDate) }
        if (!(b.eventDate instanceof Date)) { b.eventDate = new Date(b.eventDate) }
        return b.eventDate - a.eventDate
      })
    },

    constructSimpleHIVConfirmationObject: (encounter, observations) => {
      let firstPositiveHivTestDate, partnerStatus

      observations.forEach((obs) => {
        switch (obs.code.coding.code) {
          case '33660-2': // HIV test
            firstPositiveHivTestDate = obs.effectiveDateTime
            break
          case 'partner-hiv-status':
            partnerStatus = obs.valueCodeableConcept.text
            break
        }
      })

      return {
        eventType: HIV_CONFIRMATION,
        eventDate: encounter.period.start,
        data: {
          partnerStatus: partnerStatus,
          firstPositiveHivTestLocation: encounter.location[0].location.display,
          firstPositiveHivTestDate: firstPositiveHivTestDate
        }
      }
    }
  }
}
