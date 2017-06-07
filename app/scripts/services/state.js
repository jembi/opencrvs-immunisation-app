'use strict'

module.exports = function () {
  var searchResults = null
  var partialPatientDemographics = null

  return {
    getSearchResults: function () {
      return searchResults
    },
    setSearchResults: function (results) {
      searchResults = results
    },
    setPartialPatientDemographics: function (partialPatient) {
      partialPatientDemographics = partialPatient
    },
    getPartialPatientDemographics: function () {
      return partialPatientDemographics
    }
  }
}
