export default function K (object) {
  function isEnumberableNamedStringKey (key) {
    return typeof key === 'string' && object.hasOwnProperty(key)
  }

  return {
    get length () {
      let length = 0
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key)) {
          continue
        }
        length += 1
      }
      return length
    },
    some: iteratee => {
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key)) {
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
        if (!isEnumberableNamedStringKey(key)) {
          continue
        }

        result.push(iteratee(key))
      }
      return result
    },
    toSet: () => {
      const set = new Set()
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key)) {
          continue
        }
        set.add(key)
      }
      return set
    },
    every: iteratee => {
      for (const key in object) {
        if (!isEnumberableNamedStringKey(key)) {
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
        if (!isEnumberableNamedStringKey(key)) {
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
        if (!isEnumberableNamedStringKey(key)) {
          continue
        }
        iteratee(object[key])
      }
    }
  }
}
