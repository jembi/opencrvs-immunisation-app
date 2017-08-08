'use strict'

module.exports = function (Api, $q) {
  const isImmunisationEncounter = (event) => {
    return event.resourceType &&
      event.resourceType === 'Encounter' &&
      event.class &&
      event.class === 'Immunisation'
  }

  const isEventOfType = (eventTypeCode, event) => {
    return isImmunisationEncounter(event) &&
      event.type &&
      Array.isArray(event.type) &&
      event.type.some((typeElem) => {
        return typeElem.coding &&
          Array.isArray(typeElem.coding) &&
          typeElem.coding.some((codingElem) => {
            return codingElem.system &&
              codingElem.system === 'http://hearth.org/crvs/event-types' &&
              codingElem.code &&
              codingElem.code === eventTypeCode
          })
      })
  }

  return {
    sortEventsDesc: (events) => {
      return events.sort((a, b) => {
        if (!(a.eventDate instanceof Date)) { a.eventDate = new Date(a.eventDate) }
        if (!(b.eventDate instanceof Date)) { b.eventDate = new Date(b.eventDate) }
        return b.eventDate - a.eventDate
      })
    },

    getAllEncountersForPatient: (patientId, callback) => {
      Api.Encounters.get({ patient: patientId, _count: 0 }, (res) => {
        callback(null, res.entry)
      }, (err) => {
        callback(err)
      })
    },

    addObservationsToEncounters: (encountersArray) => {
      const defer = $q.defer()

      const promises = []
      encountersArray.forEach((encounter) => {
        const resource = Api.Observations.get({'encounter': encounter.resource.id}, function (result) {
          encounter._observations = result.entry
        }, function (err) {
          console.error(err)
        })
        promises.push(resource.$promise)
      })

      $q.all(promises).then(() => {
        defer.resolve(encountersArray)
      }).catch((err) => {
        console.error(err)
        defer.reject(err)
      })

      return defer.promise
    },

    formatEvents: (events) => {
      const simpleEvents = []
      events.forEach((event) => {
        simpleEvents.push(event)
      })
      return simpleEvents
    },

    isEventOfType: isEventOfType
  }
}
