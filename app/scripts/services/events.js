'use strict'

module.exports = function () {
  const CD4_COUNT = 'cd4-count'
  return {
    test: () => {
      console.log('Event service test')
    },

    constructSimpleCD4CountObject: (encounter) => {
      let providerName

      encounter._observations[0].contained.forEach((containedResource) => {
        if (containedResource.id === encounter._observations[0].performer[0].reference.substring(1)) {
          const providerGivenName = containedResource.name[0].given.join(' ')
          const providerFamilyName = containedResource.name[0].family.join(' ')
          providerName = providerGivenName + ' ' + providerFamilyName
        }
      })

      return {
        eventType: CD4_COUNT,
        eventDate: encounter.period.start,
        data: {
          cd4CountDate: encounter._observations[0].effectiveDateTime,
          cd4CountLocation: encounter.location[0].location.display,
          cd4CountResult: encounter._observations[0].valueQuantity,
          cd4CountProvider: providerName
        }
      }
    }
  }
}
