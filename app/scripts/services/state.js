'use strict'

module.exports = function () {
  var searchResults = []

  return {
    getSearchresults: function () {
      return searchResults
    },
    setSearchResults: function (results) {
      searchResults = results
    }
  }
}
