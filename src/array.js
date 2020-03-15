'use strict'

const { INDEX_SYM } = require('./constants')
const GenericType = require('./generic')

class ArrayT extends GenericType {
  /**
   * @param {string|Function} type
   */
  constructor (type, ...values) {
    super(type)
    this[INDEX_SYM] = 0

    this.push(...values)
  }

  * [Symbol.iterator] () {
    let i = 0
    while (this[i] !== undefined) {
      yield this[i]
      i++
    }
  }

  push (...values) {
    for (const value of values) {
      this.verifyType(value)
      this[this[INDEX_SYM]] = value
      this[INDEX_SYM]++
    }
  }

  get length () {
    return this[INDEX_SYM]
  }

  toString () {
    let str = ''
    const last = this.length - 1
    for (let i = 0; i < last; i++) {
      str += this[i].toString() + ','
    }
    return str + this[last]
  }

  toJSON () {
    return this.toArray()
  }

  toArray () {
    const arr = []
    for (const item of this) {
      arr.push(item)
    }
    return arr
  }
}

module.exports = ArrayT
