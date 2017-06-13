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
        encounter._observations = Api.Observations.get({'encounter.reference': { $eq: 'Encounter/' + encounter.id }}).entry
        promises.push(encounter._observations.$promise)
      })

      $q.all(promises).then(() => {
        defer.resolve(encountersArray)
      }).catch((err) => {
        console.error(err)
        defer.reject(err)
      })
    }
  }
}
