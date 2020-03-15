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

  verifyType (value) {
    const type = this[TYPE_SYM]
    const typeofType = typeof type
    if ((typeofType === 'function' && !(value instanceof type)) ||
      (typeofType === 'string' && typeof value !== type)) { // eslint-disable-line
      throw new Error('ERR_INVALID_VALUE_TYPE')
    }
  }
}

module.exports = GenericType
