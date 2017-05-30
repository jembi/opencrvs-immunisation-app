'use strict'

module.exports = function ($timeout, $http) {
  return {
    fetch: function (fileName) {
      return $timeout(function () {
        return $http.get(fileName).then(function (response) {
          return response.data
        })
      }, 30)
    }
  }
}
