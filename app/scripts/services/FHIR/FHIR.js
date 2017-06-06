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

  return {
    mapFHIRObject: function (fhirObject, FormBuilder, formData) {
      for (var fbs = 0; fbs < FormBuilder.sections.length; fbs++) {
        var section = FormBuilder.sections[fbs]

        for (var fbr = 0; fbr < section.rows.length; fbr++) {
          var row = section.rows[fbr]

          for (var fbf = 0; fbf < row.fields.length; fbf++) {
            var field = row.fields[fbf]

            if (field.FHIRMappings) {
              for (var fbm = 0; fbm < field.FHIRMappings.length; fbm++) {
                var FHIRMappingInstance = field.FHIRMappings[fbm]
                var newVal
                switch (FHIRMappingInstance.valueType) {
                  case 'formValue':
                    newVal = formData[ FHIRMappingInstance.value ]
                    break
                  case 'staticValue':
                    newVal = FHIRMappingInstance.value
                    break
                }

                setDataInResource(newVal, fhirObject, FHIRMappingInstance.path, FHIRMappingInstance.params)
              }
            }
          }
        }
      }

      return fhirObject
    }
  }
}
