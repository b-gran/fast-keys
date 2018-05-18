export default function K (object) {
  if (object === null || object === undefined) {
    throw new TypeError('Cannot convert undefined or null to object')
  }

  return {
    get length () {
      let length = 0
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key, object)) {
          continue
        }
        length += 1
      }
      return length
    },
    some: iteratee => {
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key, object)) {
          continue
        }

        if (iteratee(key)) {
          return true
        }
      }
      return false
    },
    map: iteratee => {
      const result = []
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key, object)) {
          continue
        }

        result.push(iteratee(key))
      }
      return result
    },
    toSet: () => {
      const set = new Set()
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key, object)) {
          continue
        }
        set.add(key)
      }
      return set
    },
    every: iteratee => {
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key, object)) {
          continue
        }

        if (!iteratee(key)) {
          return false
        }
      }
      return true
    },
    filter: iteratee => {
      const filteredElements = []
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key, object)) {
          continue
        }

        if (iteratee(key)) {
          filteredElements.push(key)
        }
      }
      return filteredElements
    },
    forEach: iteratee => {
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key, object)) {
          continue
        }
        iteratee(key)
      }
    },
    find: predicate => {
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key, object)) {
          continue
        }

        if (predicate(key)) {
          return key
        }
      }
      return undefined
    }
  }
}

function isEnumberableNamedStringKey (key, object) {
  return typeof key === 'string' && object.hasOwnProperty(key)
}
