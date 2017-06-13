'use strict'

module.exports = function () {
  const LINKAGE_TO_CARE = 'linkage-to-care'
  return {
    test: () => {
      console.log('Event service test')
    },

    constructSimpleLinkageToCareObject: (encounter) => {
      return {
        eventType: LINKAGE_TO_CARE,
        eventDate: encounter.period.start,
        data: {
          encounterType: encounter.type[0].coding[0].display,
          encounterLocation: encounter.location[0].location.display
        }
      }
    }
  }
}
