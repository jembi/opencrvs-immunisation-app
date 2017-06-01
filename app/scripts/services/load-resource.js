'use strict'

module.exports = function ($timeout, $http) {
  return {
    fetch: function (fileName) {
      return $http.get(fileName).then(function (response) {
        return response.data
      })
    }
  }
}
