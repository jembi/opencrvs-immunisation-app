'use strict'

module.exports = function ($scope, Api) {

  // no Auth
  var noAuthSuccess = function(result) {
    console.log(result)
  };

  var noAuthError = function(err) {
    console.log(err)
  };
  Api.HearthBeat.get(noAuthSuccess, noAuthError);



  // Authorised request
  var success = function(result) {
    console.log(result)
  };

  var error = function(err) {
    console.log(err)
  };
  Api.Patients.get(success, error);

}
