// It's important to use a class here to take advantage of V8's optimizations for classes.
// If a plain object is created by K, the performance is up to 100x worse.
class FastKeys {
  constructor (object) {
    this.__object = object
  }

  get length () {
    const object = this.__object
    let length = 0
    for (const key in object) {
      if (typeof key !== 'string' || !object.hasOwnProperty(key)) {
        continue
      }
      length += 1
    }
    return length
  }

  some (iteratee) {
    const object = this.__object
    for (const key in object) {
      if (typeof key !== 'string' || !object.hasOwnProperty(key)) {
        continue
      }

      if (iteratee(key)) {
        return true
      }
    }
    return false
  }

  map (iteratee) {
    const object = this.__object
    const result = []
    for (const key in object) {
      if (typeof key !== 'string' || !object.hasOwnProperty(key)) {
        continue
      }

      result.push(iteratee(key))
    }
    return result
  }

  toSet () {
    const object = this.__object
    const set = new Set()
    for (const key in object) {
      if (typeof key !== 'string' || !object.hasOwnProperty(key)) {
        continue
      }
      set.add(key)
    }
    return set
  }

  every (iteratee) {
    const object = this.__object
    for (const key in object) {
      if (typeof key !== 'string' || !object.hasOwnProperty(key)) {
        continue
      }

      if (!iteratee(key)) {
        return false
      }
    }
    return true
  }

  filter (iteratee) {
    const object = this.__object
    const filteredElements = []
    for (const key in object) {
      if (typeof key !== 'string' || !object.hasOwnProperty(key)) {
        continue
      }

      if (iteratee(key)) {
        filteredElements.push(key)
      }
    }
    return filteredElements
  }

  forEach (iteratee) {
    const object = this.__object
    for (const key in object) {
      if (typeof key !== 'string' || !object.hasOwnProperty(key)) {
        continue
      }
      iteratee(key)
    }
  }

  find (predicate) {
    const object = this.__object
    for (const key in object) {
      if (typeof key !== 'string' || !object.hasOwnProperty(key)) {
        continue
      }

      if (predicate(key)) {
        return key
      }
    }
    return undefined
  }
}

export default function K (object) {
  if (object === null || object === undefined) {
    throw new TypeError('Cannot convert undefined or null to object')
  }

  return new FastKeys(object)
}
