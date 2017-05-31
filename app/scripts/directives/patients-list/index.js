'use strict'
/* global angular */

module.exports = function (state) {
  var TRACNET_SYSTEM_IDENTIFIER = 'pshr:tracnetid'
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'app/scripts/directives/patients-list/view.html',
    scope: {
      results: '='
    },
    link: function (scope) {
      scope.clearSearch = function () {
        state.setSearchResults(null)
      }

      scope.togglePatientDetails = function (patient) {
        patient._control.showPatientDetails = !patient._control.showPatientDetails
      }

      var getOfficialName = function (names) {
        var officialName = {
          given: null,
          family: null
        }

        angular.forEach(names, function (nameInstance) {
          if (nameInstance.use === 'official') {
            officialName.prefix = nameInstance.prefix.join(' ')
            officialName.given = nameInstance.given.join(' ')
            officialName.family = nameInstance.family.join(' ')
          }
        })

        return officialName
      }

      var getTracnetID = function (identifiers) {
        var tracnetID = null

        angular.forEach(identifiers, function (identifierInstance) {
          if (identifierInstance.use === 'official') {
            if (identifierInstance.system === TRACNET_SYSTEM_IDENTIFIER) {
              tracnetID = identifierInstance.value
            }
          }
        })

        return tracnetID
      }

      var getGender = function (gender) {
        return gender.charAt(0).toUpperCase()
      }

      var getContact = function (contact) {
        var contactArray = []

        angular.forEach(contact, function (contactInstance) {
          var relationships = []
          var fullnames = []

          // get relationships
          angular.forEach(contactInstance.relationship, function (relationshipInstance) {
            angular.forEach(relationshipInstance.coding, function (relationship) {
              relationships.push(relationship.code)
            })
          })

          angular.forEach(contactInstance.name, function (nameInstance) {
            var fullname = nameInstance.given.join(' ') + ' ' + nameInstance.family.join(' ')
            fullnames.push(fullname)
          })

          var formattedContact = {
            relationship: relationships.join(', '),
            name: fullnames,
            telecom: contactInstance.telecom
          }

          contactArray.push(formattedContact)
        })

        return contactArray
      }

      scope.$watch('results', function (newResults, oldResults) {
        if (newResults) {
          scope.patients = []
          angular.forEach(newResults, function (resource) {
            var patient = resource.resource
            scope.patients.push({
              id: patient.id,
              name: getOfficialName(patient.name),
              gender: getGender(patient.gender),
              tracnetID: getTracnetID(patient.identifier),
              birthDate: patient.birthDate,
              telecom: patient.telecom,
              address: patient.address,
              communication: patient.communication,
              contact: getContact(patient.contact),
              extension: patient.extension,
              search: resource.search,
              _control: {
                showPatientDetails: false
              }
            })
          })

          scope.selected = []
          scope.limitOptions = [5, 10, 15]

          scope.options = {
            rowSelection: false,
            multiSelect: false,
            autoSelect: false,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: false,
            pageSelect: false
          }

          scope.query = {
            order: 'name',
            limit: 5,
            page: 1
          }
        }
      }, true)
    }
  }
}
