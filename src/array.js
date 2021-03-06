'use strict'

const { INDEX_SYM } = require('./constants')
const GenericType = require('./generic')

const compare = (a, b) => {
  const first = a.toString()
  const second = b.toString()

  if (first < second) {
    return -1
  } else if (first > second) {
    return 1
  } else {
    return 0
  }
}

class ArrayT extends GenericType {
  /**
   * @param {string|Function} type
   * @param  {...any} values
   */
  constructor (type, ...values) {
    super(type)
    this[INDEX_SYM] = 0

    this.push(...values)
  }

  // #### Iteration methods ####//
  * [Symbol.iterator] () {
    let i = 0
    while (this[i] !== undefined) {
      yield this[i]
      i++
    }
  }

  /**
   * @returns {number}
   */
  get length () {
    return this[INDEX_SYM]
  }

  /**
   * @returns {Generator<[number, any], any, undefined>}
   */
  * entries () {
    const pairs = []
    for (let i = 0; i < this.length; i++) {
      pairs.push([i, this[i]])
    }
    return yield * pairs
  }

  /**
   * @param {(value: any, index?: number, array?: ArrayT) => boolean} cb
   * @param {*} thisArg
   * @returns {boolean}
   */
  every (cb, thisArg = null) {
    const length = this.length
    for (let i = 0; i < length; i++) {
      if (!(i in this)) continue
      const item = this[i]
      const res = thisArg ? cb.call(thisArg, item, i, this) : cb(item, i, this)
      if (!res) return false
    }

    return true
  }

  /**
   * @param {(value: any, index?: number, array?: ArrayT) => boolean} cb
   * @param {*} thisArg
   * @returns {*}
   */
  find (cb, thisArg = null) {
    const length = this.length
    for (let i = 0; i < length; i++) {
      if (!(i in this)) continue
      const item = this[i]
      const res = thisArg ? cb.call(thisArg, item, i, this) : cb(item, i, this)
      if (res) return item
    }
  }

  /**
   * @param {(value: any, index?: number, array?: ArrayT) => boolean} cb
   * @param {*} thisArg
   * @returns {number}
   */
  findIndex (cb, thisArg = null) {
    const length = this.length
    for (let i = 0; i < length; i++) {
      if (!(i in this)) continue
      const item = this[i]
      const res = thisArg ? cb.call(thisArg, item, i, this) : cb(item, i, this)
      if (res) return i
    }

    return -1
  }

  /**
   * @param {(value: any, index?: number, array?: ArrayT) => void} cb
   * @param {*} thisArg
   */
  forEach (cb, thisArg = null) {
    const length = this.length
    for (let i = 0; i < length; i++) {
      if (!(i in this)) continue
      const item = this[i]

      if (thisArg) {
        cb.call(thisArg, item, i, this)
      } else {
        cb(item, i, this)
      }
    }
  }

  /**
   * @returns {Generator<number, any, undefined>}
   */
  * keys () {
    const keys = []
    for (let i = 0; i < this.length; i++) {
      keys.push(i)
    }
    return yield * keys
  }

  /**
   * @param {(value: any, index?: number, array?: ArrayT) => any} cb
   * @param {*} thisArg
   * @returns {ArrayT}
   */
  map (cb, thisArg = null) {
    const res = new ArrayT(this.getType())
    const length = this.length
    for (let i = 0; i < length; i++) {
      if (!(i in this)) continue
      const item = this[i]

      const mappedItem = thisArg ? cb.call(thisArg, item, i, this) : cb(item, i, this)
      res.push(mappedItem)
    }

    return res
  }

  /**
   * @param {(accumulator, currentvalue: any, index?: number, array?: ArrayT) => any} cb
   * @param {*} initVal
   * @returns {*}
   */
  reduce (cb, initVal = undefined) {
    if (initVal === undefined && this.length === 0) {
      throw new TypeError('Reduce of empty array with no initial value')
    }

    let acc = initVal === undefined ? this[0] : initVal
    const start = initVal === undefined ? 1 : 0

    const length = this.length
    for (let i = start; i < length; i++) {
      acc = cb(acc, this[i], i, this)
    }

    return acc
  }

  /**
   * @param {(accumulator, currentvalue: any, index?: number, array?: ArrayT) => any} cb
   * @param {*} initVal
   * @returns {*}
   */
  reduceRight (cb, initVal = undefined) {
    if (initVal === undefined && this.length === 0) {
      throw new TypeError('Reduce of empty array with no initial value')
    }

    const lastIndex = this.length - 1
    let acc = initVal === undefined ? this[lastIndex] : initVal
    const start = initVal === undefined ? lastIndex - 1 : lastIndex

    for (let i = start; i >= 0; i--) {
      acc = cb(acc, this[i], i, this)
    }

    return acc
  }

  /**
   * @param {(value: any, index?: number, array?: ArrayT) => boolean} cb
   * @param {*} thisArg
   * @returns {boolean}
   */
  some (cb, thisArg = null) {
    const length = this.length
    for (let i = 0; i < length; i++) {
      if (!(i in this)) continue
      const item = this[i]
      const res = thisArg ? cb.call(thisArg, item, i, this) : cb(item, i, this)
      if (res) return true
    }

    return false
  }

  /**
   * @returns {Generator<any, any, undefined>}
   */
  * values () {
    return yield * this.toArray()
  }

  // #### Mutator methods ####//
  /**
   * @param {number} target
   * @param {number} start
   * @param {number} end
   * @returns {ArrayT}
   */
  copyWithin (target, start = 0, end = null) {
    target = target < 0 ? this.length + target : target
    if (target < 0) target = 0

    start = start < 0 ? this.length + start : start
    if (start < 0) start = 0

    end = end !== undefined && end !== null ? end : this.length
    if (end < 0) end = this.length + end
    if (end > this.length) end = this.length

    const seq = {}
    for (let i = start; i < end; i++) {
      if (i >= this.length) break // don't extend array
      seq[i] = this[i]
    }

    for (let i = start; i < end; i++, target++) {
      if (target >= this.length) break // don't extend array
      this[target] = seq[i]
    }

    return this
  }

  /**
   * @param {*} value
   * @param {number} start
   * @param {number} end
   * @returns {ArrayT}
   */
  fill (value, start = 0, end = null) {
    this.verifyType(value)

    start = start < 0 ? this.length + start : start
    if (start < 0) start = 0

    end = end !== undefined && end !== null ? end : this.length
    if (end < 0) end = this.length + end
    if (end > this.length) end = this.length

    for (let i = start; i < end; i++) {
      this[i] = value
    }
    return this
  }

  /**
   * @returns {any}
   */
  pop () {
    this[INDEX_SYM]--
    const item = this[this[INDEX_SYM]]
    delete this[this[INDEX_SYM]]
    return item
  }

  /**
   * @param  {...any} values
   * @returns {number}
   */
  push (...values) {
    for (const value of values) {
      this.verifyType(value)
      this[this[INDEX_SYM]] = value
      this[INDEX_SYM]++
    }
    return this.length
  }

  /**
   * @returns {ArrayT}
   */
  reverse () {
    const tmp = []
    for (let i = this.length - 1; i >= 0; i--) {
      tmp.push(this[i])
    }
    for (let i = 0; i < this.length; i++) {
      this[i] = tmp[i]
    }
    return this
  }

  /**
   * @returns {*}
   */
  shift () {
    if (this.length === 0) return

    const item = this[0]
    for (let i = 1; i < this.length; i++) {
      this[i - 1] = this[i]
    }

    this[INDEX_SYM]--
    delete this[this[INDEX_SYM]]
    return item
  }

  /**
   * @param {(a: any, b: any) => number} cb
   * @returns {ArrayT}
   */
  sort (cb = null) {
    if (!cb) cb = compare

    let i = 1
    const length = this.length
    while (i < length) {
      let j = i
      while (j > 0 && cb(this[j - 1], this[j]) > 0) {
        const tmp = this[j]
        this[j] = this[j - 1]
        this[j - 1] = tmp
        j--
      }
      i++
    }
    return this
  }

  /**
   * @param {number} start
   * @param {number} deleteCount
   * @param  {...any} values
   * @returns {ArrayT}
   */
  splice (start, deleteCount = null, ...values) {
    start = start < 0 ? this.length + start : start
    if (start < 0) start = 0
    if (start > this.length) start = this.length

    if (deleteCount === undefined || deleteCount === null) deleteCount = this.length
    if (deleteCount < 0) deleteCount = 0

    // delete
    const removed = new ArrayT(this.getType())
    for (let i = start; i < start + deleteCount; i++) {
      if (i >= this.length) break
      removed.push(this[i])
    }

    // get items after delete
    const remaining = []
    for (let i = start + deleteCount; i < this.length; i++) {
      remaining.push(this[i])
    }

    // clear items after start
    let count = this.length - start
    while (count > 0) {
      this.pop()
      count--
    }

    // insert
    this.push(...values)
    this.push(...remaining)

    return removed
  }

  /**
   * @param  {...any} values
   * @returns {number}
   */
  unshift (...values) {
    const tmp = []
    for (const value of values) {
      this.verifyType(value)
      tmp.push(value)
    }

    for (let i = 0; i < this.length; i++) {
      tmp.push(this[i])
    }
    this[INDEX_SYM] += values.length

    for (let i = 0; i < this.length; i++) {
      this[i] = tmp[i]
    }

    return this.length
  }

  // #### Accessor methods ####//
  /**
   * @param  {...(ArrayT|Array)} values
   * @returns {ArrayT}
   */
  concat (...values) {
    const res = this.clone()

    for (const item of values) {
      if (item[Symbol.iterator]) {
        res.push(...item)
      } else {
        res.push(item)
      }
    }

    return res
  }

  /**
   * @param {(value: any, index?: number, array?: ArrayT) => boolean} cb
   * @param {*} thisArg
   * @returns {ArrayT}
   */
  filter (cb, thisArg = null) {
    const res = new ArrayT(this.getType())
    const length = this.length
    for (let i = 0; i < length; i++) {
      if (!(i in this)) continue
      const item = this[i]

      if (thisArg ? cb.call(thisArg, item, i, this) : cb(item, i, this)) {
        res.push(item)
      }
    }

    return res
  }

  /**
   * @param {*} searchElement
   * @param {number} fromIndex
   * @returns {boolean}
   */
  includes (searchElement, fromIndex = 0) {
    fromIndex = fromIndex < 0 ? this.length + fromIndex : fromIndex
    if (fromIndex < 0) fromIndex = 0

    for (let i = fromIndex; i < this.length; i++) {
      if (searchElement === this[i]) return true
    }
    return false
  }

  /**
   * @param {*} searchElement
   * @param {number} fromIndex
   * @returns {number}
   */
  indexOf (searchElement, fromIndex = 0) {
    fromIndex = fromIndex < 0 ? this.length + fromIndex : fromIndex
    if (fromIndex < 0) fromIndex = 0

    for (let i = fromIndex; i < this.length; i++) {
      if (searchElement === this[i]) return i
    }
    return -1
  }

  /**
   * @param {string} separator
   * @returns {string}
   */
  join (separator = ',') {
    let str = ''
    const last = this.length - 1
    for (let i = 0; i < last; i++) {
      str += this[i].toString() + separator
    }
    return str + this[last].toString()
  }

  /**
   * @param {*} searchElement
   * @param {number} fromIndex
   * @returns {number}
   */
  lastIndexOf (searchElement, fromIndex = null) {
    fromIndex = fromIndex !== undefined && fromIndex !== null ? fromIndex : this.length - 1
    if (fromIndex < 0) fromIndex = this.length + fromIndex
    if (fromIndex > this.length - 1) fromIndex = this.length - 1

    for (let i = fromIndex; i >= 0; i--) {
      if (searchElement === this[i]) return i
    }
    return -1
  }

  /**
   * @param {number} begin
   * @param {number} end
   * @returns {ArrayT}
   */
  slice (begin = 0, end = null) {
    begin = begin < 0 ? this.length + begin : begin
    if (begin < 0) begin = 0

    end = end !== undefined && end !== null ? end : this.length
    if (end < 0) end = this.length + end
    if (end > this.length) end = this.length

    const res = new ArrayT(this.getType())
    for (let i = begin; i < end; i++) {
      res.push(this[i])
    }
    return res
  }

  /**
   * @returns {Array}
   */
  toJSON () {
    return this.toArray()
  }

  /**
   * @returns {string}
   */
  toString () {
    return this.join(',')
  }

  /**
   * @param {string|string[]} locales
   * @param {object} options
   * @returns {string}
   */
  toLocaleString (locales = null, options = {}) {
    let str = ''
    const last = this.length - 1
    for (let i = 0; i < last; i++) {
      str += this[i].toLocaleString(locales, options) + ','
    }
    return str + this[last].toLocaleString(locales, options)
  }

  // #### Static methods ####//
  /**
   * @param {string|Function} type
   * @param  {any} value
   * @returns {boolean}
   */
  static isArray (type, value) {
    if (ArrayT.isArrayT(value)) return value.getType() === type
    if (!value[Symbol.iterator]) return false

    for (const item of value) {
      if (!GenericType.isTypeOf(type, item)) return false
    }

    return true
  }

  /**
   * @param  {any} value
   * @returns {boolean}
   */
  static isArrayT (value) {
    return value instanceof ArrayT
  }

  /**
   * @param {string|Function} type
   * @param  {...any} values
   * @returns {ArrayT}
   */
  static of (type, ...values) {
    return new ArrayT(type, ...values)
  }

  /**
   * @param {string|Function} type
   * @param {(value: any, index?: number, array?: ArrayT) => any} cb
   * @param {*} thisArg
   * @returns {ArrayT}
   */
  static from (type, values, cb = null, thisArg = null) {
    const res = new ArrayT(type)
    if (values[Symbol.iterator]) {
      const it = values[Symbol.iterator]()
      let next = it.next()
      let i = 0
      while (!next.done) {
        if (cb) {
          const mappedItem = thisArg ? cb.call(thisArg, next.value, i, res) : cb(next.value, i, res)
          res.push(mappedItem)
        } else {
          res.push(next.value)
        }
        next = it.next()
        i++
      }
    } else if (typeof values === 'object' && values.length) { // { length: x }
      const length = Number(values.length)
      if (Number.isNaN(length)) return res
      if (!Number.isFinite(length)) throw new RangeError('Invalid array length')

      for (let i = 0; i < length; i++) {
        if (cb) {
          const mappedItem = thisArg ? cb.call(thisArg, undefined, i, res) : cb(undefined, i, res)
          res.push(mappedItem)
        } else {
          res.push(undefined)
        }
      }
    }

    return res
  }

  // #### Extended methods ####//
  /**
   * @returns {ArrayT}
   */
  clone () {
    return new ArrayT(this.getType(), ...this)
  }

  /**
   * @param {(value: any, index?: number, array?: ArrayT) => any} cb
   * @param {*} thisArg
   * @returns {Array}
   */
  mapRaw (cb, thisArg = null) {
    const res = []
    const length = this.length
    for (let i = 0; i < length; i++) {
      if (!(i in this)) continue
      const item = this[i]

      const mappedItem = thisArg ? cb.call(thisArg, item, i, this) : cb(item, i, this)
      res.push(mappedItem)
    }

    return res
  }

  /**
   * @returns {Array}
   */
  toArray () {
    return [...this]
  }
}

module.exports = ArrayT
