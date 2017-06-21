'use strict'

const walkPath = (pathArr, object) => {
  const path = pathArr[0]
  const newPathArr = pathArr.slice(1)

  if (!object[path]) {
    return ['']
  }
  if (pathArr.length === 1) {
    return object[path]
  }

  if (Array.isArray(object[path])) {
    let values = []
    object[path].forEach((element) => {
      const result = walkPath(newPathArr, element)
      values = values.concat(result)
    })
    return values
  } else {
    return walkPath(newPathArr, object[path])
  }
}

const removeBrackets = (path) => {
  return path.split('[').map((each) => {
    if (each[1] === ']') {
      return each.substring(2)
    }
    return each
  }).join('')
}

module.exports = function (path, object) {
  const pathArr = removeBrackets(path).split('.')

  const result = walkPath(pathArr, object)
  if (!result) {
    return []
  }
  if (!Array.isArray(result)) {
    return [result]
  }
  return result
}
