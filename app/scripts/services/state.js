'use strict'

module.exports = function () {
  var searchResults = null

  return {
    getSearchResults: function () {
      return searchResults
    },
    setSearchResults: function (results) {
      searchResults = results
    }
  }
}
