'use strict'

module.exports = function () {
  var setField = function (resource, key, value, params) {
    if (!resource) {
      console.error('Trying to add a value to a resource that does not exist: ' + key + ' - ' + value)
      return
    }

    // if key has index assigned to it.
    var arrayIndexMatch = key.match(/\[(.*?)\]/)
    var arrayIndex = null
    if (arrayIndexMatch) {
      arrayIndex = arrayIndexMatch[1]
      key = key.replace(arrayIndexMatch[0], '')
    }

    // on the last tree node - set value
    if (params) {
      var checkProperty = params.split('=')[0]
      var checkPropertyVal = params.split('=')[1]

      if (resource[checkProperty] && resource[checkProperty] === checkPropertyVal) {
        if (resource.hasOwnProperty(key)) {
          if (arrayIndex) {
            resource[key].splice(arrayIndex, 0, value)
          } else {
            resource[key] = value
          }
        } else {
          Object.defineProperty(resource, key, {
            'value': value,
            'writable': true,
            'enumerable': true,
            'configurable': true
          })
        }
      }
    } else {
      if (resource.hasOwnProperty(key)) {
        if (arrayIndex) {
          resource[key].splice(arrayIndex, 0, value)
        } else {
          resource[key] = value
        }
      } else {
        Object.defineProperty(resource, key, {
          'value': value,
          'writable': true,
          'enumerable': true,
          'configurable': true
        })
      }
    }
  }

  var setDataInResource = function (value, resource, path, params) {
    var pathArray = path.split('.')
    var pathRootLevel = pathArray[0]

    // path has sub tree nodes
    if (pathArray.length > 1) {
      // if key has index assigned to it.
      var arrayIndexMatch = pathRootLevel.match(/\[(.*?)\]/)
      var arrayIndex = null
      var pathTemp, resourceTemp
      if (arrayIndexMatch) {
        arrayIndex = arrayIndexMatch[1]
        var pathRootLevelTemp = pathRootLevel.replace(arrayIndexMatch[0], '')
        pathTemp = path.replace(pathRootLevel + '.', '')
        resourceTemp = resource[pathRootLevelTemp][arrayIndex]
      } else {
        pathTemp = path.replace(pathRootLevel + '.', '')
        resourceTemp = resource[pathRootLevel]
      }

      var paramsTemp = null
      if (params) {
        paramsTemp = params.replace(pathRootLevel + '.', '')
      }

      if (Array.isArray(resourceTemp)) {
        for (var i = 0; i < resourceTemp.length; i++) {
          setDataInResource(value, resourceTemp[i], pathTemp, paramsTemp)
        }
      } else {
        setDataInResource(value, resourceTemp, pathTemp, paramsTemp)
      }
    } else {
      setField(resource, pathRootLevel, value, params)
    }
  }

  const forEachFormBuilderField = (FormBuilder, func) => {
    FormBuilder.sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.fields.forEach((field) => {
          func(field, row, section)
        })
      })
    })
  }

  return {

    /**
     * mapFHIRResources - maps FormBuilder form fields to multiple FHIR resources
     *
     * @param  {Object} fhirResourceDict - a dictionary where each key-value pair is
     * a resourceKey and a resource object. The main resource that all the others link
     * to must use a key of 'main', otherwise the keys can be anything you choose. the
     * FHIRMappings property on each field will be used to map it to these resources
     * @param  {Object} FormBuilder - the formbuilder object
     * @param  {Object} formData - the formdata set by formbuilder
     * @return {Object} the fhirResourceDict with each resource mapped to the formData
     * values
     */
    mapFHIRResources: function (fhirResourceDict, FormBuilder, formData) {
      forEachFormBuilderField(FormBuilder, (field, row, section) => {
        if (field.FHIRMappings) {
          field.FHIRMappings.forEach((fhirMap) => {
            if (!fhirMap.resourceKey) {
              return console.error(`FHIRMapping for ${field.name} has no resourceKey, skipping`)
            }

            const resource = fhirResourceDict[fhirMap.resourceKey]
            if (!resource) {
              return console.error(`FHIR resource dictionary has no key ${fhirMap.resourceKey}, skipping`)
            }

            var newVal
            switch (fhirMap.valueType) {
              case 'formValue':
                newVal = formData[ fhirMap.value ]
                break
              case 'staticValue':
                newVal = fhirMap.value
                break
            }

            if (newVal) {
              setDataInResource(newVal, resource, fhirMap.path, fhirMap.params)
            }
          })
        }
      })

      return fhirResourceDict
    }
  }
}
