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
    it('constructor - it should support initial values in constructor', () => {
      const numArray = new ArrayT('number', 2, 3)

      expect(numArray[0]).to.be.equal(2)
      expect(numArray[1]).to.be.equal(3)

      const personCollection = new ArrayT(Person, new Person('john doe'), new Person('jane doe'))
      expect(personCollection[0].name).to.be.equal('john doe')
      expect(personCollection[1].name).to.be.equal('jane doe')
    })

    it('concat - it should fail contating invalid types', () => {
      const arr = new ArrayT('number', 1, 2)
      expect(() => arr.concat([3, 4], '5')).to.throw() // 5 throws
      expect(() => arr.concat(new ArrayT('string', '5', '6'))).to.throw()
    })

    it('concat - it should work similar like arrays', () => {
      const array1 = new ArrayT('string', 'a', 'b', 'c')
      const array2 = new ArrayT('string', 'd', 'e', 'f')
      const array3 = array1.concat(array2)

      expect(array3).to.be.instanceof(ArrayT)
      expect(array3.toArray()).to.be.eql(['a', 'b', 'c', 'd', 'e', 'f'])
      expect(array1.toArray()).to.be.eql(['a', 'b', 'c'])
    })

    it('concat - it should accept also primitive arrays as arguments', () => {
      const arr = new ArrayT('number', 1, 2)
      expect(arr.concat([3, 4]).toArray()).to.be.eql([1, 2, 3, 4])
    })

    it('concat - it should concatenate more than two arrays', () => {
      const num1 = new ArrayT('number', 1, 2, 3)
      const num2 = new ArrayT('number', 4, 5, 6)
      const num3 = new ArrayT('number', 7, 8, 9)
      const numbers = num1.concat(num2, num3).toArray()

      expect(numbers).to.be.eql([1, 2, 3, 4, 5, 6, 7, 8, 9])
    })

    it('concat - it should concatenate values to an arrays', () => {
      const num1 = new ArrayT('number', 1, 2, 3)
      const num2 = new ArrayT('number', 7, 8, 9)
      const numbers = num1.concat(4, 5, 6, num2).toArray()

      expect(numbers).to.be.eql([1, 2, 3, 4, 5, 6, 7, 8, 9])
    })

    it('concat - it should concatenate nested arrays', () => {
      const num1 = new ArrayT(Array, [1, 2, 3])
      const num2 = new ArrayT(Array, [7, 8], [9])
      const numbers = num1.concat([[4], [5]], [[6]], num2).toArray()

      expect(numbers).to.be.eql([[1, 2, 3], [4], [5], [6], [7, 8], [9]])
    })

    it('copyWithin - it should work similar like arrays', () => {
      const strArr = new ArrayT('string', 'a', 'b', 'c', 'd', 'e')
      strArr.copyWithin(0, 3, 4)

      expect(strArr.toArray()).to.eql(['d', 'b', 'c', 'd', 'e'])

      strArr.copyWithin(1, 3)
      expect(strArr.toArray()).to.eql(['d', 'd', 'e', 'd', 'e'])

      expect(
        new ArrayT('number', 1, 2, 3, 4, 5).copyWithin(-2).toArray()
      ).to.eql([1, 2, 3, 1, 2])

      expect(
        new ArrayT('number', 1, 2, 3, 4, 5).copyWithin(0, 3).toArray()
      ).to.eql([4, 5, 3, 4, 5])

      expect(
        new ArrayT('number', 1, 2, 3, 4, 5).copyWithin(0, 3, 4).toArray()
      ).to.eql([4, 2, 3, 4, 5])

      expect(
        new ArrayT('number', 1, 2, 3, 4, 5).copyWithin(-2, -3, -1).toArray()
      ).to.eql([1, 2, 3, 3, 4])
    })

    it('entries - it should work similar like arrays', () => {
      const arr = new ArrayT('string', 'a', 'b', 'c')
      const iter = arr.entries()

      expect(iter.next()).to.eql({ value: [0, 'a'], done: false })
      expect(iter.next()).to.eql({ value: [1, 'b'], done: false })
      expect(iter.next()).to.eql({ value: [2, 'c'], done: false })
      expect(iter.next()).to.eql({ value: undefined, done: true })

      const primitive = ['a', 'b', 'c']
      let i = 0
      for (const [index, element] of arr.entries()) {
        expect(index).to.be.equal(i)
        expect(element).to.be.equal(primitive[i])
        i++
      }
    })

    it('every - it return true in case if all items matches the rule', () => {
      const arr = new ArrayT('number', 1, 30, 39, 29, 10, 13)

      function isBelowThreshold (currentValue) {
        return currentValue < 40
      }

      expect(arr.every(isBelowThreshold)).to.be.true()
      expect(arr.every(function (currentValue) { return currentValue < 40 })).to.be.true()
      expect(arr.every((currentValue) => currentValue < 40)).to.be.true()
    })

    it('every - it return false in case if at least one item fails the rule', () => {
      const arr = new ArrayT('number', 1, 30, 39, 29, 10, 13)

      function isBelowThreshold (currentValue) {
        return currentValue < 20
      }

      expect(arr.every(isBelowThreshold)).to.be.false()
      expect(arr.every(function (currentValue) { return currentValue < 20 })).to.be.false()
      expect(arr.every((currentValue) => currentValue < 20)).to.be.false()
    })

    it('every - it support all arguments like arrays', () => {
      const arr = new ArrayT('number', 1, 30, 39, 29, 10, 13)
      const primitive = [1, 30, 39, 29, 10, 13]

      expect(
        arr.every(function (value, index, array) {
          expect(value).to.be.equal(primitive[index])
          expect(index).to.be.a('number')
          expect(array).to.be.equal(arr)
          expect(this).to.be.equal('test')

          return value < 40
        }, 'test')
      ).to.be.true()

      expect(
        arr.every((value, index, array) => {
          expect(value).to.be.equal(primitive[index])
          expect(index).to.be.a('number')
          expect(array).to.be.equal(arr)
          expect(this).not.to.be.equal('test')

          return value < 40
        }, 'test')
      ).to.be.true()
    })

    it('every - it support changes on initial array (modifying, appending, and deleting)', () => {
      let arr = new ArrayT('number', 1, 2, 3, 4)
      // modify
      expect(
        arr.every((elem, index, arr) => {
          arr[index + 1] -= 3
          return elem < 2
        })
      ).to.be.equal(true)

      arr = new ArrayT('number', 1, 2, 3)
      // append
      let i = 0
      expect(
        arr.every((elem, index, arr) => {
          arr.push(4)
          i = index
          return elem < 4
        })
      ).to.be.false()
      expect(i).to.be.equal(3)

      // delete
      arr = new ArrayT('number', 1, 2, 3, 4)
      i = 0
      expect(
        arr.every((elem, index, arr) => {
          arr.pop()
          i = index
          return elem < 4
        })
      ).to.be.true()
      expect(i).to.be.equal(1)
    })

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
