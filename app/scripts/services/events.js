'use strict'

module.exports = function () {
  const CD4_COUNT = 'cd4-count'
  return {
    test: () => {
      console.log('Event service test')
    },
    
    constructSimpleCD4CountObject: (encounter) => {
      return {
        eventType: CD4_COUNT,
        encounter: {
          date: encounter.period.start,
          type: encounter.type[0].coding[0].display,
          location: encounter.location[0].location.display,
        },
        observations: {
          cd4CountResult: encounter._observations[0].
        },
        practitioner: {
          practitioner: 'TODO'
        }
      }
    }
  }
}
