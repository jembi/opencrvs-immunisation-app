'use strict'

module.exports = function () {
  var TRACNET_SYSTEM_IDENTIFIER = 'pshr:tracnetid'
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'app/scripts/directives/patients-list/view.html',
    scope: {
      results: '='
    },
    link: function (scope) {

      var getOfficialName = function (names) {
        var officialName = {
          given: null,
          family: null
        }

        angular.forEach(names, function(nameInstance, key) {
          if (nameInstance.use === 'official') {
            console.log(nameInstance)

            officialName.prefix = nameInstance.prefix.join(' ')
            officialName.given = nameInstance.given.join(' ')
            officialName.family = nameInstance.family.join(' ')
          }
        })

        return officialName
      }

      var getTracnetID = function (identifiers) {
        var tracnetID = null

        angular.forEach(identifiers, function(identifierInstance, key) {
          if (identifierInstance.use === 'official') {
            if (identifierInstance.system === TRACNET_SYSTEM_IDENTIFIER) {
              console.log(identifierInstance.value)
              tracnetID = identifierInstance.value
            }
          }
        })

        return tracnetID
      }

      var getGender = function (gender) {
        return gender.charAt(0).toUpperCase()
      }

      scope.patients = []
      angular.forEach(scope.results, function(patient, key) {
        console.log(patient)


        var officialName = getOfficialName(patient.name)


        scope.patients.push({
          id: patient.id,
          name: {
            prefix: officialName.prefix,
            given: officialName.given,
            family: officialName.family
          },
          gender: getGender(patient.gender),
          tracnetID: getTracnetID(patient.identifier),
          birthDate: patient.birthDate
        })
      });



      scope.selected = [];
      scope.limitOptions = [5, 10, 15];
      
      scope.options = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: true,
        pageSelect: true
      };
      
      scope.query = {
        order: 'name',
        limit: 5,
        page: 1
      };
      
      


    }
  }
}
