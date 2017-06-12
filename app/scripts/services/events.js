'use strict'

module.exports = function () {
  const HIV_CONFIRMATION = 'hiv-confirmation'

  return {
    test: () => {
      console.log('Event service test')
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
