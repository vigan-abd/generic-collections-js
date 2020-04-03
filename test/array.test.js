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

      expect(strArr.toArray()).to.be.eql(['d', 'b', 'c', 'd', 'e'])

      strArr.copyWithin(1, 3)
      expect(strArr.toArray()).to.be.eql(['d', 'd', 'e', 'd', 'e'])

      expect(
        new ArrayT('number', 1, 2, 3, 4, 5).copyWithin(-2).toArray()
      ).to.be.eql([1, 2, 3, 1, 2])

      expect(
        new ArrayT('number', 1, 2, 3, 4, 5).copyWithin(0, 3).toArray()
      ).to.be.eql([4, 5, 3, 4, 5])

      expect(
        new ArrayT('number', 1, 2, 3, 4, 5).copyWithin(0, 3, 4).toArray()
      ).to.be.eql([4, 2, 3, 4, 5])

      expect(
        new ArrayT('number', 1, 2, 3, 4, 5).copyWithin(-2, -3, -1).toArray()
      ).to.be.eql([1, 2, 3, 3, 4])
    })

    it('entries - it should work similar like arrays', () => {
      const arr = new ArrayT('string', 'a', 'b', 'c')
      const iter = arr.entries()

      expect(iter.next()).to.be.eql({ value: [0, 'a'], done: false })
      expect(iter.next()).to.be.eql({ value: [1, 'b'], done: false })
      expect(iter.next()).to.be.eql({ value: [2, 'c'], done: false })
      expect(iter.next()).to.be.eql({ value: undefined, done: true })

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
      ).to.be.true()
      expect(i).to.be.equal(2)

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

    it('fill - it should throw on invalid fill type', () => {
      const arr = new ArrayT('number', 1, 2, 3, 4)
      expect(() => arr.fill('3')).to.throw()
    })

    it('fill - it should behave similar like array', () => {
      const arr = new ArrayT('number', 1, 2, 3, 4)

      expect(arr.fill(0, 2, 4)).to.be.instanceof(ArrayT)
      expect(arr.toArray()).to.be.eql([1, 2, 0, 0])
      expect(arr.fill(5, 1).toArray()).to.be.eql([1, 5, 5, 5])
      expect(arr.fill(6).toArray()).to.be.eql([6, 6, 6, 6])

      expect(new ArrayT('number', 1, 2, 3).fill(4).toArray()).to.be.eql([4, 4, 4])
      expect(new ArrayT('number', 1, 2, 3).fill(4, 1).toArray()).to.be.eql([1, 4, 4])
      expect(new ArrayT('number', 1, 2, 3).fill(4, 1, 2).toArray()).to.be.eql([1, 4, 3])
      expect(new ArrayT('number', 1, 2, 3).fill(4, 1, 1).toArray()).to.be.eql([1, 2, 3])
      expect(new ArrayT('number', 1, 2, 3).fill(4, 3, 3).toArray()).to.be.eql([1, 2, 3])
      expect(new ArrayT('number', 1, 2, 3).fill(4, -3, -2).toArray()).to.be.eql([4, 2, 3])
      expect(new ArrayT('number', 1, 2, 3).fill(4, NaN, NaN).toArray()).to.be.eql([1, 2, 3])
      expect(new ArrayT('number', 1, 2, 3).fill(4, 3, 5).toArray()).to.be.eql([1, 2, 3])
    })

    it('filter - it should behave like array', () => {
      const words = new ArrayT('string', 'spray', 'limit', 'elite', 'exuberant', 'destruction', 'present')
      const result = words.filter(word => word.length > 6)
      expect(words.toArray()).to.be.eql(['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'])
      expect(result.toArray()).to.be.eql(['exuberant', 'destruction', 'present'])
    })

    it('filter - it support changes on initial array (modifying, appending, and deleting)', () => {
      let words = new ArrayT('string', 'spray', 'limit', 'exuberant', 'destruction', 'elite', 'present')

      const modifiedWords = words.filter((word, index, arr) => {
        arr[index + 1] += ' extra'
        return word.length < 6
      })
      expect(modifiedWords.toArray()).to.be.eql(['spray'])

      // Appending new words
      words = new ArrayT('string', 'spray', 'limit', 'exuberant', 'destruction', 'elite', 'present')
      const appendedWords = words.filter((word, index, arr) => {
        arr.push('new')
        return word.length < 6
      })
      expect(appendedWords.toArray()).to.be.eql(['spray', 'limit', 'elite'])

      // Deleting words
      words = new ArrayT('string', 'spray', 'limit', 'exuberant', 'destruction', 'elite', 'present')
      const deleteWords = words.filter((word, index, arr) => {
        arr.pop()
        return word.length < 6
      })
      expect(deleteWords.toArray()).to.be.eql(['spray', 'limit'])
    })

    it('find - it should find element if it exists', () => {
      const arr = new ArrayT('number', 5, 12, 8, 130, 44)
      const found = arr.find(element => element > 10)
      expect(found).to.be.equal(12)
    })

    it('find - it should return undefined if element doesn\'t exists', () => {
      const arr = new ArrayT('number', 5, 12, 8, 13, 44)
      const found = arr.find(element => element > 50)
      expect(found).to.be.undefined()
    })

    it('find - it support changes on initial array (modifying, appending, and deleting)', () => {
      const array = new ArrayT('number', 0, 1, 2, 3, 4, 5, 6)

      const found = array.find(function (value, index) {
        if (index >= 2 && index <= 4) {
          delete array[index]
        }
        return value > 2
      })
      expect(found).to.be.equal(3)
    })

    it('findIndex - it should find index of element if it exists', () => {
      const arr = new ArrayT('number', 5, 12, 8, 130, 44)
      const found = arr.findIndex(element => element > 10)
      expect(found).to.be.equal(1)
    })

    it('findIndex - it should return -1 if element doesn\'t exists', () => {
      const arr = new ArrayT('number', 5, 12, 8, 13, 44)
      const found = arr.findIndex(element => element > 50)
      expect(found).to.be.equal(-1)
    })

    it('findIndex - it support changes on initial array (modifying, appending, and deleting)', () => {
      const array = new ArrayT('number', 0, 1, 2, 3, 4, 5, 6)

      const found = array.findIndex(function (value, index) {
        if (index >= 2 && index <= 4) {
          delete array[index]
        }
        return value > 2
      })
      expect(found).to.be.equal(3)
      expect(array[found]).to.be.undefined()
    })

    it('forEach - it should behave like arrays', () => {
      const arr = new ArrayT('number', 0, 1, 2, 3)
      let i = 0
      const res = arr.forEach(function (value, index, array) {
        expect(this).to.be.equal('test')
        expect(value).to.be.equal(i)
        expect(index).to.be.equal(i)
        expect(array).to.be.equal(arr)
        i++
      }, 'test')
      expect(res).to.be.undefined()
    })

    it('forEach - it support changes on initial array (modifying, appending, and deleting)', () => {
      const arr = new ArrayT('number', 0, 1, 2, 3)
      const store = []
      const len = arr.length
      const res = arr.forEach((value, index, array) => {
        array.push(index + len)
        store.push(value)
      })
      expect(res).to.be.undefined()
      expect(store).to.be.eql([0, 1, 2, 3])
      expect(arr.toArray()).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7])
    })

    it('includes - it should return true if array includes element', () => {
      expect(new ArrayT('number', 1, 2, 3).includes(2)).to.be.true()
      expect(new ArrayT('string', 'a', 'b', 'c').includes('b')).to.be.true()
      expect(new ArrayT('boolean', true, false).includes(false)).to.be.true()
      expect(new ArrayT('boolean', true, false).includes(true)).to.be.true()
    })

    it('includes - it should return false if array doesn\'t include element', () => {
      expect(new ArrayT('number', 1, 2, 3).includes(5)).to.be.false()
      expect(new ArrayT('string', 'a', 'b', 'c').includes('d')).to.be.false()
      expect(new ArrayT('boolean', false, false).includes(true)).to.be.false()
    })

    it('includes - it should work also with index param', () => {
      const arr = new ArrayT('string', 'a', 'b', 'c')
      expect(arr.includes('c', 1)).to.be.true()
      expect(arr.includes('c', 3)).to.be.false()
      expect(arr.includes('a', -100)).to.be.true()
      expect(arr.includes('b', -100)).to.be.true()
      expect(arr.includes('c', -100)).to.be.true()
      expect(arr.includes('a', -2)).to.be.false()
    })

    it('indexOf - it should return index position if array includes element', () => {
      expect(new ArrayT('number', 1, 2, 3).indexOf(3)).to.be.equal(2)
      expect(new ArrayT('number', 2, 9, 9).indexOf(9)).to.be.equal(1)
      expect(new ArrayT('string', 'a', 'b', 'c').indexOf('b')).to.be.equal(1)
      expect(new ArrayT('boolean', true, false).indexOf(false)).to.be.equal(1)
      expect(new ArrayT('boolean', true, false).indexOf(true)).to.be.equal(0)
    })

    it('indexOf - it should return -1 if array doesn\'t include element', () => {
      expect(new ArrayT('number', 1, 2, 3).indexOf(5)).to.be.equal(-1)
      expect(new ArrayT('string', 'a', 'b', 'c').indexOf('d')).to.be.equal(-1)
      expect(new ArrayT('boolean', false, false).indexOf(true)).to.be.equal(-1)
    })

    it('indexOf - it should work also with start index param', () => {
      const arr = new ArrayT('number', 2, 9, 9)
      expect(arr.indexOf(2)).to.be.equal(0)
      expect(arr.indexOf(7)).to.be.equal(-1)
      expect(arr.indexOf(9, 2)).to.be.equal(2)
      expect(arr.indexOf(2, -1)).to.be.equal(-1)
      expect(arr.indexOf(2, -3)).to.be.equal(0)

      const indices = new ArrayT('number')
      const array = new ArrayT('string', 'a', 'b', 'a', 'c', 'a', 'd')
      const element = 'a'
      let idx = array.indexOf(element)
      while (idx !== -1) {
        indices.push(idx)
        idx = array.indexOf(element, idx + 1)
      }
      expect(indices.toArray()).to.be.eql([0, 2, 4])
    })

    it('join - it should behave like arrays', () => {
      const arr1 = new ArrayT('string', 'Wind', 'Water', 'Fire')
      expect(arr1.join()).equal(arr1.toArray().join()) // 'Wind,Water,Fire'
      expect(arr1.join(', ')).equal(arr1.toArray().join(', ')) // 'Wind, Water, Fire'
      expect(arr1.join(' + ')).equal(arr1.toArray().join(' + ')) // 'Wind + Water + Fire'
      expect(arr1.join('')).equal(arr1.toArray().join('')) // 'WindWaterFire'

      const arr2 = new ArrayT(Date, new Date('2019-01-03'), new Date())
      expect(arr2.join(';')).to.be.equal(arr2.toArray().join(';'))
    })

    it('keys - it should behave like arrays', () => {
      const arr = new ArrayT('string', 'a', 'b', 'c')
      const iter = arr.keys()

      expect(iter.next()).to.be.eql({ value: 0, done: false })
      expect(iter.next()).to.be.eql({ value: 1, done: false })
      expect(iter.next()).to.be.eql({ value: 2, done: false })
      expect(iter.next()).to.be.eql({ value: undefined, done: true })

      let i = 0
      for (const key of arr.keys()) {
        expect(key).to.be.equal(i)
        i++
      }
    })

    it('lastIndexOf - it should return index position if array includes element', () => {
      expect(new ArrayT('number', 1, 2, 3).lastIndexOf(3)).to.be.equal(2)
      expect(new ArrayT('number', 2, 9, 9).lastIndexOf(9)).to.be.equal(2)
      expect(new ArrayT('string', 'a', 'b', 'c').lastIndexOf('b')).to.be.equal(1)
      expect(new ArrayT('boolean', false, false).lastIndexOf(false)).to.be.equal(1)
      expect(new ArrayT('boolean', true, false, true, false).lastIndexOf(true)).to.be.equal(2)
    })

    it('lastIndexOf - it should return -1 if array doesn\'t include element', () => {
      expect(new ArrayT('number', 1, 2, 3).lastIndexOf(5)).to.be.equal(-1)
      expect(new ArrayT('string', 'a', 'b', 'c').lastIndexOf('d')).to.be.equal(-1)
      expect(new ArrayT('boolean', false, false).lastIndexOf(true)).to.be.equal(-1)
    })

    it('lastIndexOf - it should work also with start index param', () => {
      const arr = new ArrayT('number', 2, 5, 9, 2)
      expect(arr.lastIndexOf(2, 3)).to.be.equal(3)
      expect(arr.lastIndexOf(2, 2)).to.be.equal(0)
      expect(arr.lastIndexOf(2, -2)).to.be.equal(0)
      expect(arr.lastIndexOf(2, -1)).to.be.equal(3)

      const indices = new ArrayT('number')
      const array = new ArrayT('string', 'a', 'b', 'a', 'c', 'a', 'd')
      const element = 'a'
      let idx = array.lastIndexOf(element)
      while (idx !== -1) {
        indices.push(idx)
        idx = (idx > 0 ? array.lastIndexOf(element, idx - 1) : -1)
      }
      expect(indices.toArray()).to.be.eql([4, 2, 0])
    })

    it('length - it should adjust to array length', () => {
      const arr = new ArrayT('number', 2, 5, 9, 2)
      expect(arr.length).to.be.equal(4)
      arr.push(5, 6)
      expect(arr.length).to.be.equal(6)
      let i = 0
      while (i < 3) { arr.pop(); i++ }
      expect(arr.length).to.be.equal(3)
    })

    it('map - it should behave like arrays', () => {
      const arr = new ArrayT('number', 0, 1, 2, 3)
      let i = 0
      const res = arr.map(function (value, index, array) {
        expect(this).to.be.equal('test')
        expect(value).to.be.equal(i)
        expect(index).to.be.equal(i)
        expect(array).to.be.equal(arr)
        i++
        return Math.pow(value, 2)
      }, 'test')
      expect(res.toArray()).to.be.eql([0, 1, 4, 9])
    })

    it('map - it should fail when type changes', () => {
      expect(() => {
        new ArrayT('number', 0, 1, 2, 3).map((value) => value.toString())
      }).to.throw('ERR_INVALID_VALUE_TYPE')
    })

    it('map - it support changes on initial array (modifying, appending, and deleting)', () => {
      const arr = new ArrayT('number', 0, 1, 2, 3)
      const store = []
      const len = arr.length
      const res = arr.map((value, index, array) => {
        array.push(index + len)
        store.push(value)
        return value - 1
      })
      expect(res.toArray()).to.be.eql([-1, 0, 1, 2])
      expect(store).to.be.eql([0, 1, 2, 3])
      expect(arr.toArray()).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7])
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
