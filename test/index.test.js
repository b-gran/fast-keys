import * as R from 'ramda'
import K from '../src/index'

describe('K', () => {
  describe('length', () => {
    it('returns 0 for the empty object', () => {
      expect(K({}).length).toBe(0)
    })

    it('returns the number of own keys', () => {
      const object = {
        1: null,
        2: undefined,
        3: false,
        4: 0,
      }
      expect(K(object).length).toBe(4)
    })

    it('skips inherited keys', () => {
      const object = getObjectWithInheritedProperties({ foo: 1, bar: 1, baz: 1}, { x: 1, y: 1 })
      expect(K(object).length).toBe(3)
    })

    it('skips non-enumerable and non-string keys', () => {
      const object = getObjectWithSymbolAndNonEnumerableProperties({ foo: 1, bar: 1 })
      expect(K(object).length).toBe(2)
    })
  })

  describe('some()', () => {
    it('returns false for the empty object regardless of predicate', () => {
      expect(K({}).some(R.T)).toBe(false)
    })

    it('passes only the key to the predicate', () => {
      const object = {
        foo: null,
      }

      const spy = jest.fn(R.T)
      K(object).some(spy)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith('foo')
    })

    it('returns true if one key passes the predicate', () => {
      const object = {
        1: null,
        2: undefined,
        3: false,
        4: 0,
      }

      const spy = jest.fn(key => key === '4')
      expect(K(object).some(spy)).toBe(true)

      // Key ordering is not guaranteed, so it's possible the predicate
      // could just be called once (with 4)
      expect(spy.mock.calls.length).toBeGreaterThanOrEqual(1)
    })

    it('returns false if no key passes the predicate', () => {
      const object = {
        1: null,
        2: undefined,
        3: false,
        4: 0,
      }
      expect(K(object).some(R.F)).toBe(false)
    })

    it('skips inherited keys', () => {
      const object = getObjectWithInheritedProperties({ 1: 1, 2: 1 }, { 3: 1, 4: 1})
      const spy = jest.fn(R.F)
      expect(K(object).some(spy)).toBe(false)

      expect(spy).toHaveBeenCalledWith('1')
      expect(spy).toHaveBeenCalledWith('2')
      expect(spy).not.toHaveBeenCalledWith('3')
      expect(spy).not.toHaveBeenCalledWith('4')
    })

    it('skips non-enumerable and non-string keys', () => {
      const object = getObjectWithSymbolAndNonEnumerableProperties({ foo: 1, bar: 1 })
      const spy = jest.fn(R.F)
      expect(K(object).some(spy)).toBe(false)
      expect(spy).toHaveBeenCalledTimes(2)
    })
  })

  describe('map()', () => {
    it('returns an empty array for the empty object', () => {
      expect(K({}).map(R.T)).toEqual([])
    })

    it('passes the key to the iteratee', () => {
      const object = { foo: 1, bar: 1 }
      const spy = jest.fn()
      K(object).map(spy)

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenCalledWith('foo')
      expect(spy).toHaveBeenCalledWith('bar')
    })

    it('returns an array consisting of the results of the iteratee', () => {
      const object = { foo: 1, bar: 1 }
      expect(K(object).map(R.identity)).toEqual([ 'foo', 'bar' ])
    })

    it('skips inherited keys', () => {
      const object = getObjectWithInheritedProperties({ 1: 1, 2: 1 }, { 3: 1, 4: 1})
      const spy = jest.fn()
      K(object).map(spy)

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenCalledWith('1')
      expect(spy).toHaveBeenCalledWith('2')
      expect(spy).not.toHaveBeenCalledWith('3')
      expect(spy).not.toHaveBeenCalledWith('4')
    })

    it('skips non-enumerable and non-string keys', () => {
      const object = getObjectWithSymbolAndNonEnumerableProperties({ foo: 1, bar: 1 })
      const spy = jest.fn()
      K(object).map(spy)

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenCalledWith('foo')
      expect(spy).toHaveBeenCalledWith('bar')
    })
  })

  describe('toSet()', () => {
    it('returns an empty Set for the empty object', () => {
      expect(K({}).toSet()).toEqual(new Set())
    })

    it('returns a Set consisting of the keys of the object', () => {
      const object = { foo: 1, bar: 1 }
      expect(K(object).toSet()).toEqual(new Set([ 'foo', 'bar' ]))
    })

    it('skips inherited keys', () => {
      const object = getObjectWithInheritedProperties({ 1: 1, 2: 1 }, { 3: 1, 4: 1})
      expect(K(object).toSet()).toEqual(new Set([ '1', '2' ]))
    })

    it('skips non-enumerable and non-string keys', () => {
      const object = getObjectWithSymbolAndNonEnumerableProperties({ foo: 1, bar: 1 })
      expect(K(object).toSet()).toEqual(new Set([ 'foo', 'bar' ]))
    })
  })

  describe('every()', () => {
    it('returns true for the empty object', () => {
      expect(K({}).every(R.F)).toBe(true)
    })

    it('returns false if any key fails the predicate', () => {
      const object = { 1: 1, 2: 1, 3: 1, 4: 1}
      const spy = jest.fn(k => k !== '4')
      expect(K(object).every(spy)).toBe(false)
      expect(spy).toHaveBeenCalledWith('4')
    })

    it('returns true if every key passes the predicate', () => {
      const object = { 1: 1, 2: 1, 3: 1, 4: 1}
      const spy = jest.fn(R.T)
      expect(K(object).every(spy)).toBe(true)
      expect(spy).toHaveBeenCalledTimes(4)
    })

    it('skips inherited keys', () => {
      const object = getObjectWithInheritedProperties({ 1: 1, 2: 1 }, { 3: 1, 4: 1})
      const spy = jest.fn(R.T)
      K(object).every(spy)

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenCalledWith('1')
      expect(spy).toHaveBeenCalledWith('2')
      expect(spy).not.toHaveBeenCalledWith('3')
      expect(spy).not.toHaveBeenCalledWith('4')
    })

    it('skips non-enumerable and non-string keys', () => {
      const object = getObjectWithSymbolAndNonEnumerableProperties({ foo: 1, bar: 1 })
      const spy = jest.fn(R.T)
      K(object).every(spy)

      expect(spy).toHaveBeenCalledTimes(2)
      expect(spy).toHaveBeenCalledWith('foo')
      expect(spy).toHaveBeenCalledWith('bar')
    })

    describe('filter()', () => {
      it('returns an empty object for the empty object', () => {
        expect(K({}).filter(R.F)).toEqual([])
        expect(K({}).filter(R.T)).toEqual([])
      })

      it('omits keys that fail the predicate', () => {
        const object = { 1: 1, 2: 1, 3: 1, 4: 1}
        const spy = jest.fn(k => k !== '4')
        expect(K(object).filter(spy)).toEqual([ '1', '2', '3' ])
        expect(spy).toHaveBeenCalledTimes(4)
      })

      it('skips inherited keys', () => {
        const object = getObjectWithInheritedProperties({ 1: 1, 2: 1 }, { 3: 1, 4: 1})
        const spy = jest.fn(R.T)
        K(object).filter(spy)

        expect(spy).toHaveBeenCalledTimes(2)
        expect(spy).toHaveBeenCalledWith('1')
        expect(spy).toHaveBeenCalledWith('2')
        expect(spy).not.toHaveBeenCalledWith('3')
        expect(spy).not.toHaveBeenCalledWith('4')
      })

      it('skips non-enumerable and non-string keys', () => {
        const object = getObjectWithSymbolAndNonEnumerableProperties({ foo: 1, bar: 1 })
        const spy = jest.fn(R.T)
        K(object).filter(spy)

        expect(spy).toHaveBeenCalledTimes(2)
        expect(spy).toHaveBeenCalledWith('foo')
        expect(spy).toHaveBeenCalledWith('bar')
      })
    })

    describe('forEach()', () => {
      it('does not call the iteratee for the empty object', () => {
        const spy = jest.fn()
        K({}).forEach(spy)

        expect(spy).not.toHaveBeenCalled()
      })

      it('calls the iteratee for every key', () => {
        const object = { 1: 1, foo: 1, bar: 1 }
        const spy = jest.fn()
        K(object).forEach(spy)

        expect(spy).toHaveBeenCalledTimes(3)
        expect(spy).toHaveBeenCalledWith('foo')
        expect(spy).toHaveBeenCalledWith('bar')
        expect(spy).toHaveBeenCalledWith('1')
      })

      it('always returns null or undefined', () => {
        const emptyResult = K({}).forEach(R.T)
        const nonEmptyResult = K({ 1: 1, 2: 1 }).forEach(R.T)
        expect(R.isNil(emptyResult)).toBeTruthy()
        expect(R.isNil(nonEmptyResult)).toBeTruthy()
      })

      it('skips inherited keys', () => {
        const object = getObjectWithInheritedProperties({ 1: 1, 2: 1 }, { 3: 1, 4: 1})
        const spy = jest.fn()
        K(object).forEach(spy)

        expect(spy).toHaveBeenCalledTimes(2)
        expect(spy).toHaveBeenCalledWith('1')
        expect(spy).toHaveBeenCalledWith('2')
        expect(spy).not.toHaveBeenCalledWith('3')
        expect(spy).not.toHaveBeenCalledWith('4')
      })

      it('skips non-enumerable and non-string keys', () => {
        const object = getObjectWithSymbolAndNonEnumerableProperties({ foo: 1, bar: 1 })
        const spy = jest.fn()
        K(object).forEach(spy)

        expect(spy).toHaveBeenCalledTimes(2)
        expect(spy).toHaveBeenCalledWith('foo')
        expect(spy).toHaveBeenCalledWith('bar')
      })
    })
  })
})

function getObjectWithInheritedProperties (ownProps, inheritedProps) {
  const prototype = Object.create({})
  Object.keys(inheritedProps).forEach(key => prototype[key] = inheritedProps[key])

  function Klass () {
    Object.keys(ownProps).forEach(key => this[key] = ownProps[key])
  }
  Klass.prototype = prototype
  return new Klass()
}

function getObjectWithSymbolAndNonEnumerableProperties (ownProps) {
  const object = { ...ownProps }
  Object.defineProperty(
    object,
    Symbol.for('symbol property'),
    { value: 'something'}
  )
  Object.defineProperty(
    object,
    'string property, but not enumerable',
    { value: 'something', enumerable: false }
  )
  return object
}
