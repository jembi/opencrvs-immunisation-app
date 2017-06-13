'use strict'

module.exports = function () {
  const HIV_CONFIRMATION = 'hiv-confirmation'
  const FIRST_VIRAL_LOAD = 'first-viral-load'

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
    },

    constructSimpleFirstViralLoadObject: (encounter, observations) => {
      let providerName

      observations[0].contained.forEach((containedResource) => {
        if (containedResource.id === observations[0].performer[0].reference.substring(1)) {
          const providerGivenName = containedResource.name[0].given.join(' ')
          const providerFamilyName = containedResource.name[0].family.join(' ')
          providerName = providerGivenName + ' ' + providerFamilyName
        }
      })

      return {
        eventType: FIRST_VIRAL_LOAD,
        eventDate: encounter.period.start,
        data: {
          firstViralLoadDate: observations[0].effectiveDateTime,
          firstViralLoadResults: observations[0].valueQuantity,
          firstViralLoadLocation: encounter.location[0].location.display,
          firstViralLoadProvider: providerName
        }
      }
    }
  }
}
