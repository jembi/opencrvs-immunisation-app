'use strict'

module.exports = function (Api, $q) {
  const BIRTHNOTIFICATION = 'birth-notification'
  const IMMUNISATION = 'immunisation'

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

  const constructSimpleBirthNotificationObject = (encounter, location) => {
    let encounterType

    encounter.type.forEach((type) => {
      if (type.coding[0].system === 'http://hearth.org/crvs/event-types') {
        encounterType = type.coding[0].display
      }
    })

    return {
      eventTitle: 'Birth Notification',
      eventType: BIRTHNOTIFICATION,
      eventDate: encounter.period.start,
      data: {
        encounterType: encounterType,
        birthPlace: location.name,
        birthDate: encounter.period.start
      }
    }
  }

  const constructSimpleImmunisationObject = (encounter, location, immunisation) => {
    let encounterType

    encounter.type.forEach((type) => {
      if (type.coding[0].system === 'http://hearth.org/crvs/event-types') {
        encounterType = type.coding[0].display
      }
    })

    return {
      eventTitle: 'Immunisation',
      eventType: IMMUNISATION,
      eventDate: encounter.period.start,
      data: {
        encounterType: encounterType,
        encounterLocation: location.name,
        encounterDate: encounter.period.start,
        immunisationAdministered: immunisation.vaccineCode.coding[0].code
      }
    }
  }

  const constructSimpleImmunisationEventObject = (encounter) => {
    return {
      eventTitle: 'Immunisation',
      eventType: IMMUNISATION_EVENT,
      eventDate: encounter.period.start,
      data: {
        immunisationAdministerd: encounter._immunisation.vaccineCode.text,
        encounterLocation: encounter.location[0].location.display
      }
    }
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

    resolveReferences: (encountersArray) => {
      const defer = $q.defer()

      const promises = []
      encountersArray.forEach((encounter) => {
        const observation = Api.Observations.get({ encounter: encounter.resource.id }, function (result) {
          encounter._observations = result.entry
        }, function (err) {
          console.error(err)
        })
        promises.push(observation.$promise)

        if (encounter.resource && encounter.resource.location && encounter.resource.location[0] && encounter.resource.location[0].location && encounter.resource.location[0].location.reference) {
          const split = encounter.resource.location[0].location.reference.split('/')
          const location = Api.Reference.get({ resource: split[0], id: split[1] }, function (result) {
            encounter._location = result
          }, function (err) {
            console.error(err)
          })
          promises.push(location.$promise)
        }

        const immunisation = Api.Reference.get({ resource: 'Immunization', encounter: encounter.resource.id }, function (result) {
          if (result && result.entry && result.entry[0] && result.entry[0].resource) {
            encounter._immunisation = result.entry[0].resource
          }
        }, function (err) {
          console.error(err)
        })
        promises.push(immunisation.$promise)
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
        if (isEventOfType(BIRTHNOTIFICATION, event.resource)) {
          event = constructSimpleBirthNotificationObject(event.resource, event._location || {}, event._immunisation || {})
        } else if (isEventOfType(IMMUNISATION, event.resource)) {
          event = constructSimpleImmunisationObject(event.resource, event._location || {}, event._immunisation || {})
        } else {
          console.error('Unknown event type found', event)
        }
        simpleEvents.push(event)
      })
      return simpleEvents
    },

    constructSimpleBirthNotificationObject: constructSimpleBirthNotificationObject,
    constructSimpleImmunisationObject: constructSimpleImmunisationObject,

    isEventOfType: isEventOfType
  }
}
