'use strict'

const { expect } = require('chai')
  .use(require('dirty-chai'))

const GenericType = require('../src/generic')

module.exports = () => {
  describe('# generic-tests', () => {
    it('constructor - it should throw when type is not string or function', () => {
      expect(() => new GenericType()).to.throw('ERR_INVALID_GENERIC_TYPE')
      expect(() => new GenericType(22)).to.throw('ERR_INVALID_GENERIC_TYPE')
      expect(() => new GenericType([])).to.throw('ERR_INVALID_GENERIC_TYPE')
      expect(() => new GenericType({})).to.throw('ERR_INVALID_GENERIC_TYPE')
      expect(() => new GenericType('bigint')).to.throw('ERR_INVALID_GENERIC_TYPE')
    })

    it('constructor - it should work with primitive types as type', () => {
      expect(new GenericType('boolean')).to.be.instanceOf(GenericType)
      expect(new GenericType('function')).to.be.instanceOf(GenericType)
      expect(new GenericType('number')).to.be.instanceOf(GenericType)
      expect(new GenericType('object')).to.be.instanceOf(GenericType)
      expect(new GenericType('string')).to.be.instanceOf(GenericType)
      expect(new GenericType('symbol')).to.be.instanceOf(GenericType)
    })

    it('constructor - it should work with function constructors as type', () => {
      expect(new GenericType(Buffer)).to.be.instanceOf(GenericType)
      expect(new GenericType(Array)).to.be.instanceOf(GenericType)
      expect(new GenericType(Boolean)).to.be.instanceOf(GenericType)
      expect(new GenericType(Function)).to.be.instanceOf(GenericType)
      expect(new GenericType(Number)).to.be.instanceOf(GenericType)
      expect(new GenericType(Object)).to.be.instanceOf(GenericType)
      expect(new GenericType(String)).to.be.instanceOf(GenericType)
    })

    it('getType - it should return the right type', () => {
      expect(new GenericType('number').getType()).to.be.equal('number')
      expect(new GenericType(Buffer).getType()).to.be.equal(Buffer)
    })

    it('isTypeOf - it should return false on invalid types', () => {
      expect(GenericType.isTypeOf('number', '33')).to.be.false()
      expect(GenericType.isTypeOf(Buffer, [0x33])).to.be.false()
      expect(GenericType.isTypeOf(Boolean, false)).to.be.false()
    })

    it('isTypeOf - it should return true on valid types', () => {
      expect(GenericType.isTypeOf('number', 33)).to.be.true()
      expect(GenericType.isTypeOf(Buffer, Buffer.from([0x33]))).to.be.true()
      expect(GenericType.isTypeOf('boolean', false)).to.be.true()
    })

    it('verifyType - it should throw on invalid types', () => {
      expect(() => { new GenericType('number').verifyType('33') }).to.throw('ERR_INVALID_VALUE_TYPE')
      expect(() => { new GenericType(Buffer).verifyType([0x33]) }).to.throw('ERR_INVALID_VALUE_TYPE')
      expect(() => { new GenericType(Boolean).verifyType(false) }).to.throw('ERR_INVALID_VALUE_TYPE')
    })

    it('verifyType - it should not throw on valid types', () => {
      expect(() => { new GenericType('number').verifyType(33) }).not.to.throw()
      expect(() => { new GenericType(Buffer).verifyType(Buffer.from([0x33])) }).not.to.throw()
      expect(() => { new GenericType('boolean').verifyType(false) }).not.to.throw()
    })
  })
}
