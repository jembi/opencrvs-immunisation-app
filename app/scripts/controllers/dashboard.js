'use strict'

module.exports = function ($scope, Api) {
  // Authorised request
  var success = function (result) {
    console.log(result)
  }

  var error = function (err) {
    console.log(err)
  }
  Api.Patients.get(success, error)
}
