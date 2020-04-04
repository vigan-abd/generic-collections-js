'use strict'

const { TYPE_SYM } = require('./constants')

class GenericType {
  /**
   * @param {string|Function} type
   */
  constructor (type) {
    const typeofType = typeof type
    if (!['string', 'function'].includes(typeofType)) {
      throw new Error('ERR_INVALID_GENERIC_TYPE')
    }
    if (typeofType === 'string' && !['boolean', 'function', 'number', 'object', 'string', 'symbol'].includes(type)) {
      throw new Error('ERR_INVALID_GENERIC_TYPE')
    }

    this[TYPE_SYM] = type
  }

  /**
   * @returns {string|Function}
   */
  getType () {
    return this[TYPE_SYM]
  }

  /**
   * @param {*} value
   */
  verifyType (value) {
    const type = this[TYPE_SYM]
    if (!GenericType.isTypeOf(type, value)) {
      throw new Error('ERR_INVALID_VALUE_TYPE')
    }
  }

  /**
   * @param {string|Function} type
   * @param {*} value
   */
  static isTypeOf (type, value) {
    const typeofType = typeof type
    return (typeofType === 'function' && (value instanceof type)) ||
      (typeofType === 'string' && typeof value === type) // eslint-disable-line
  }
}

module.exports = GenericType
