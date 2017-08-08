'use strict'

module.exports = function (state, $location) {
  const TRACNET_SYSTEM_IDENTIFIER = 'ocrvs:tracnet:id'
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'app/scripts/directives/patients-list/view.html',
    scope: {
      results: '=',
      singlePatient: '='
    },
    link: function (scope) {
      scope.clearSearch = function () {
        state.setSearchResults(null)
        state.setPartialPatientDemographics(null)
        scope.$emit('clear-search')
      }

      scope.createPatient = function () {
        $location.path('/add-patient')
      }

      scope.togglePatientDetails = function (patient) {
        patient._control.showPatientDetails = !patient._control.showPatientDetails
      }

      var getOfficialName = function (names) {
        var officialName = {
          given: null,
          family: null
        }

        for (var i = 0; i < names.length; i++) {
          var nameInstance = names[i]
          if (nameInstance.use === 'official') {
            officialName.prefix = nameInstance.prefix.join(' ')
            officialName.given = nameInstance.given.join(' ')
            officialName.family = nameInstance.family.join(' ')
          }
        }

        return officialName
      }

      var getTracnetID = function (identifiers) {
        var tracnetID = null

        for (var i = 0; i < identifiers.length; i++) {
          var identifierInstance = identifiers[i]
          if (identifierInstance.use === 'official') {
            if (identifierInstance.system === TRACNET_SYSTEM_IDENTIFIER) {
              tracnetID = identifierInstance.value
            }
          }
        }

        return tracnetID
      }

      var getGender = function (gender) {
        if (gender) {
          return gender.charAt(0).toUpperCase()
        }
      }

      var getContact = function (contact) {
        var contactArray = []

        if (contact) {
          for (var c = 0; c < contact.length; c++) {
            var contactInstance = contact[c]
            var relationships = []
            var fullnames = []

            // get relationships
            for (var r = 0; r < contactInstance.relationship.length; r++) {
              var relationshipInstance = contactInstance.relationship[r]
              for (var i = 0; i < relationshipInstance.coding.length; i++) {
                var relationship = relationshipInstance.coding[i]
                relationships.push(relationship.code)
              }
            }

            for (var n = 0; n < contactInstance.name.length; n++) {
              var nameInstance = contactInstance.name[n]
              var fullname = nameInstance.given.join(' ') + ' ' + nameInstance.family.join(' ')
              fullnames.push(fullname)
            }

            var formattedContact = {
              relationship: relationships.join(', '),
              name: fullnames,
              telecom: contactInstance.telecom
            }

            contactArray.push(formattedContact)
          }
        }

        return contactArray
      }

      scope.createPatientsList = function (results) {
        var patientsArr = []

        if (results) {
          for (var i = 0; i < results.length; i++) {
            var patient = results[i].resource
            patientsArr.push({
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
              search: results[i].search,
              _control: {
                showPatientDetails: false
              }
            })
          }
        }

        scope.patients = {
          count: patientsArr.length,
          data: patientsArr
        }

        scope.selected = []
        scope.limitOptions = [10, 20, 50, 100]

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
          limit: 10,
          page: 1
        }
      }

      scope.$watch('results', function (newResults, oldResults) {
        if (newResults) {
          scope.searchType = state.getSearchType()
          scope.createPatientsList(newResults)
        }
      }, true)

      scope.$watch(function () { return state.getPartialPatientDemographics() }, function () {
        scope.partialPatientDemographics = state.getPartialPatientDemographics()
      })
    }
  }
}
