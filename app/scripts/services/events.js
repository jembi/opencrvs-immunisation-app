'use strict'

module.exports = function (Api, $q) {
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
        promises.push(Api.Observations.get({'encounter.reference': { $eq: 'Encounter/' + encounter.id }}))
      })

      $q.all(promises).then((arrayOfObservationBundles) => {
        encountersArray.forEach((v, k) => {
          encountersArray[k]._observations = arrayOfObservationBundles[k].entry
        })
        defer.resolve(encountersArray)
      }).catch((err) => {
        console.error(err)
        defer.reject(err)
      })
    }
  }
}
