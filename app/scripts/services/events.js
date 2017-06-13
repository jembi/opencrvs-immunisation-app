'use strict'

module.exports = function (Api, $q) {
  const HIV_CONFIRMATION = 'hiv-confirmation'

  const isHIVEncounter = (event) => {
    return event.resourceType &&
      event.resourceType === 'Encounter' &&
      event.class &&
      event.class === 'HIVAIDS'
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

    getAllEncountersForPatient: (patientId, callback) => {
      Api.Encounters.get({ patient: patientId }, (res) => {
        callback(res.entry)
      }, (err) => {
        callback(err)
      })
    },

    addObservationsToEncounters: (encountersArray) => {
      const defer = $q.defer()

      const promises = []
      encountersArray.forEach((encounter) => {
        encounter._observations = Api.Observations.get({'encounter.reference': { $eq: 'Encounter/' + encounter.id }}).entry
        promises.push(encounter._observations.$promise)
      })

      $q.all(promises).then(() => {
        defer.resolve(encountersArray)
      }).catch((err) => {
        console.error(err)
        defer.reject(err)
      })
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
