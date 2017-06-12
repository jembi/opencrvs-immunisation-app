'use strict'

module.exports = function () {
  const HIV_CONFIRMATION = 'hiv-confirmation'

  return {
    test: () => {
      console.log('Event service test')
    },

    constructSimpleHIVConfirmationObject: (encounter, observation) => {
      return {
        eventType: HIV_CONFIRMATION,
        data: {
          partnerStatus: observation.extension[0].valueString,
          firstPositiveHivTestLocation: encounter.location[0].location.display,
          firstPositiveHivTestDate: observation.effectiveDateTime
        }
      }
    }
  }
}
