'use strict'

module.exports = function () {
  var searchResults = null
  var eventsArray = []

  return {
    getSearchResults: function () {
      return searchResults
    },
    setSearchResults: function (results) {
      searchResults = results
    },

    // Mocked out state service function for events
    getEventsArray: function () {
      return eventsArray
    },
    setEventsArray: function (events) {
      eventsArray = events
    },
    pushToEventsArray: function (event) {
      eventsArray.push(event)
    }
  }
}
