'use strict'

const { expect } = require('chai')
  .use(require('dirty-chai'))

const ArrayT = require('../src/array')

class Person {
  constructor (name) {
    this.name = name
  }

  toString () {
    return `name: ${this.name}`
  }
}

module.exports = () => {
  describe('# array-tests', () => {
    it('push - it should work when the type is correct', () => {
      const numArray = new ArrayT('number')
      numArray.push(2, 3)

      expect(numArray[0]).to.be.equal(2)
      expect(numArray[1]).to.be.equal(3)

      const personCollection = new ArrayT(Person)
      personCollection.push(new Person('john doe'), new Person('jane doe'))
      expect(personCollection[0].name).to.be.equal('john doe')
      expect(personCollection[1].name).to.be.equal('jane doe')
    })

    it('push - it should throw on invalid type', () => {
      expect(() => { new ArrayT('number').push('33') }).to.throw('ERR_INVALID_VALUE_TYPE')
      expect(() => { new ArrayT(Person).push({ name: 'john doe' }) }).to.throw('ERR_INVALID_VALUE_TYPE')
    })

    it('toString - to string method should be like in arrays', () => {
      const numArray = new ArrayT('number')
      numArray.push(2, 3)
      expect(numArray.toString()).to.be.equal('2,3')

      const personCollection = new ArrayT(Person)
      personCollection.push(new Person('john doe'), new Person('jane doe'))
      expect(personCollection.toString()).to.be.equal('name: john doe,name: jane doe')
    })

    it('toArray - it should convert it to primitive array', () => {
      const numArray = new ArrayT('number')
      numArray.push(2, 3)

      expect(numArray.toArray()).to.be.instanceOf(Array)
      expect(Array.isArray(numArray.toArray())).to.be.true()
    })

    it('toJSON - it should serialize it as array', () => {
      const numArray = new ArrayT('number')
      numArray.push(2, 3)
      expect(JSON.stringify(numArray, null, 0)).to.be.equal('[2,3]')

      const personCollection = new ArrayT(Person)
      personCollection.push(new Person('john doe'), new Person('jane doe'))
      expect(JSON.stringify(personCollection, null, 0)).to.be.equal('[{"name":"john doe"},{"name":"jane doe"}]')
    })

    it('for loop - for loop should work like in primitive arrays', () => {
      const numArray = new ArrayT('number')
      numArray.push(2, 3)
      const otherArray = [2, 3]

      for (let i = 0; i < numArray.length; i++) {
        expect(numArray[i]).to.be.equal(otherArray[i])
      }
    })

    it('for of loop - for of loop should work like in primitive arrays', () => {
      const numArray = new ArrayT('number')
      numArray.push(2, 3)

      const otherArray = [2, 3]

      let i = 0
      for (const item of numArray) {
        expect(item).to.be.equal(otherArray[i])
        i++
      }
    })

    it('for in loop - for in loop should work like in primitive arrays', () => {
      const numArray = new ArrayT('number')
      numArray.push(2, 3)

      let i = 0
      for (const key in numArray) {
        expect(key).to.be.equal(i.toString())
        i++
      }
    })
  })
}
