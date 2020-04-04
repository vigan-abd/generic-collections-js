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

    it('clone - it should clone the array on first level', () => {
      const arr = new ArrayT('number', 1, 2, 3, 4)
      const clone = arr.clone()
      expect(arr).not.to.equal(clone)
      expect(arr.toArray()).to.eql(clone.toArray())

      arr[1] = 47
      expect(arr[1]).not.to.equal(clone[1])
      expect(clone[1]).to.be.equal(2)
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

    it('mapRaw - it should behave like arrays', () => {
      const arr = new ArrayT('number', 0, 1, 2, 3)
      let i = 0
      const res = arr.mapRaw(function (value, index, array) {
        expect(this).to.be.equal('test')
        expect(value).to.be.equal(i)
        expect(index).to.be.equal(i)
        expect(array).to.be.equal(arr)
        i++
        return Math.pow(value, 2)
      }, 'test')
      expect(res).to.be.an('array')
      expect(res).to.be.eql([0, 1, 4, 9])
    })

    it('mapRaw - it should not fail when type changes', () => {
      expect(() => {
        new ArrayT('number', 0, 1, 2, 3).mapRaw((value) => value.toString())
      }).not.to.throw()
    })

    it('mapRaw - it support changes on initial array (modifying, appending, and deleting)', () => {
      const arr = new ArrayT('number', 0, 1, 2, 3)
      const store = []
      const len = arr.length
      const res = arr.mapRaw((value, index, array) => {
        array.push(index + len)
        store.push(value)
        return value - 1
      })
      expect(res).to.be.an('array')
      expect(res).to.be.eql([-1, 0, 1, 2])
      expect(store).to.be.eql([0, 1, 2, 3])
      expect(arr.toArray()).to.be.eql([0, 1, 2, 3, 4, 5, 6, 7])
    })

    it('pop - it should behave like array', () => {
      const numArray = new ArrayT('number', 2, 3)
      expect(numArray.pop()).to.be.equal(3)
      expect(numArray.pop()).to.be.equal(2)
      expect(numArray.pop()).to.be.undefined()
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

    it('reduce - it should behave like arrays', () => {
      const arr = new ArrayT('number', 1, 2, 3, 4)
      const maxCallback = (acc, cur) => Math.max(acc.x, cur.x)

      expect(arr.reduce((acc, cur) => acc + cur)).to.be.equal(10)
      expect(arr.reduce((acc, cur) => acc + cur, 5)).to.be.equal(15)
      expect(new ArrayT('number').reduce((acc, cur) => acc + cur, 3)).to.be.equal(3)
      expect(new ArrayT('number', 2).reduce((acc, cur) => acc + cur)).to.be.equal(2)
      expect(new ArrayT('number', 1).reduce((acc, cur) => acc + cur, 2)).to.be.equal(3)
      expect(new ArrayT('object', { x: 2 }, { x: 22 }, { x: 42 }).reduce(maxCallback)).to.be.NaN()
      expect(new ArrayT('object', { x: 2 }, { x: 22 }).reduce(maxCallback)).to.be.equal(22)
      expect(new ArrayT('object', { x: 2 }).reduce(maxCallback)).to.be.eql({ x: 2 })
    })

    it('reduce - it should not fail when type changes', () => {
      expect(() => {
        new ArrayT('number', 0, 1, 2, 3).reduce((acc, value) => {
          acc[value] = true
          return acc
        }, {})
      }).not.to.throw()
    })

    it('reduce - it support changes on initial array (modifying, appending, and deleting)', () => {
      const arr = new ArrayT('number', 0, 1, 2, 3)
      const store = []
      const len = arr.length
      const res = arr.reduce((acc, value, index, array) => {
        array.push(index + len)
        store.push(value)
        return value - 1
      })
      expect(res).to.be.equal(2)
      expect(store).to.be.eql([1, 2, 3])
      expect(arr.toArray()).to.be.eql([0, 1, 2, 3, 5, 6, 7])
    })

    it('reduceRight - it should behave like arrays', () => {
      const arr = new ArrayT('number', 1, 2, 3, 4)
      const maxCallback = (acc, cur) => Math.max(acc.x, cur.x)

      expect(arr.reduceRight((acc, cur) => acc + cur)).to.be.equal(10)
      expect(arr.reduceRight((acc, cur) => acc + cur, 5)).to.be.equal(15)
      expect(
        new ArrayT(Array, [0, 1], [2, 3], [4, 5]).reduceRight((acc, cur) => acc.concat(cur))
      ).to.be.eql([4, 5, 2, 3, 0, 1])
      expect(new ArrayT('number').reduceRight((acc, cur) => acc + cur, 3)).to.be.equal(3)
      expect(new ArrayT('number', 2).reduceRight((acc, cur) => acc + cur)).to.be.equal(2)
      expect(new ArrayT('number', 1).reduceRight((acc, cur) => acc + cur, 2)).to.be.equal(3)
      expect(new ArrayT('object', { x: 2 }, { x: 22 }, { x: 42 }).reduceRight(maxCallback)).to.be.NaN()
      expect(new ArrayT('object', { x: 2 }, { x: 22 }).reduceRight(maxCallback)).to.be.equal(22)
      expect(new ArrayT('object', { x: 2 }).reduceRight(maxCallback)).to.be.eql({ x: 2 })
    })

    it('reduceRight - it should not fail when type changes', () => {
      expect(() => {
        new ArrayT('number', 0, 1, 2, 3).reduceRight((acc, value) => {
          acc[value] = true
          return acc
        }, {})
      }).not.to.throw()
    })

    it('reduceRight - it support changes on initial array (modifying, appending, and deleting)', () => {
      const arr = new ArrayT('number', 0, 1, 2, 3)
      const store = []
      const len = arr.length
      const res = arr.reduceRight((acc, value, index, array) => {
        array.push(index + len)
        store.push(value)
        return value - 1
      })
      expect(res).to.be.equal(-1)
      expect(store).to.be.eql([2, 1, 0])
      expect(arr.toArray()).to.be.eql([0, 1, 2, 3, 6, 5, 4])
    })

    it('reverse - it should behave like arrays', () => {
      const arr = new ArrayT('number', 0, 1, 2, 3)
      const res = arr.reverse()
      expect(res.toArray()).to.be.eql([3, 2, 1, 0])
      expect(arr.toArray()).to.be.eql([3, 2, 1, 0])
      expect(new ArrayT('number').reverse().toArray()).to.be.eql([])
      expect(new ArrayT('string', 'a').reverse().toArray()).to.be.eql(['a'])
    })

    it('shift - it should behave like arrays', () => {
      const arr = new ArrayT('string', 'angel', 'clown')
      expect(arr.shift()).to.be.equal('angel')
      expect(arr.toArray()).to.be.eql(['clown'])
      expect(arr.shift()).to.be.equal('clown')
      expect(arr.shift()).to.be.undefined()
    })

    it('slice - it should behave like arrays', () => {
      const animals = new ArrayT('string', 'ant', 'bison', 'camel', 'duck', 'elephant')

      expect(animals.slice(2).toArray()).to.be.eql(['camel', 'duck', 'elephant'])
      expect(animals.slice(2, 4).toArray()).to.be.eql(['camel', 'duck'])
      expect(animals.slice(1, 5).toArray()).to.be.eql(['bison', 'camel', 'duck', 'elephant'])
      expect(animals.slice().toArray()).to.be.eql(animals.toArray())
      expect(animals.slice(-2).toArray()).to.be.eql(['duck', 'elephant'])
      expect(animals.slice(-3, 4).toArray()).to.be.eql(['camel', 'duck'])
      expect(animals.slice(-3, -1).toArray()).to.be.eql(['camel', 'duck'])
      expect(animals.toArray()).to.be.eql(['ant', 'bison', 'camel', 'duck', 'elephant'])
    })
    it('some - it return false in case if all items matches the rule', () => {
      const arr = new ArrayT('number', 1, 30, 39, 29, 10, 13)

      function isBelowThreshold (currentValue) {
        return currentValue < 1
      }

      expect(arr.some(isBelowThreshold)).to.be.false()
      expect(arr.some(function (currentValue) { return currentValue < 1 })).to.be.false()
      expect(arr.some((currentValue) => currentValue < 1)).to.be.false()
    })

    it('some - it return true in case if at least one item fails the rule', () => {
      const arr = new ArrayT('number', 1, 30, 39, 29, 10, 13)

      function isBelowThreshold (currentValue) {
        return currentValue < 20
      }

      expect(arr.some(isBelowThreshold)).to.be.true()
      expect(arr.some(function (currentValue) { return currentValue < 20 })).to.be.true()
      expect(arr.some((currentValue) => currentValue < 20)).to.be.true()
    })

    it('some - it support all arguments like arrays', () => {
      const arr = new ArrayT('number', 1, 30, 39, 29, 10, 13)
      const primitive = [1, 30, 39, 29, 10, 13]

      expect(
        arr.some(function (value, index, array) {
          expect(value).to.be.equal(primitive[index])
          expect(index).to.be.a('number')
          expect(array).to.be.equal(arr)
          expect(this).to.be.equal('test')

          return value < 15
        }, 'test')
      ).to.be.true()

      expect(
        arr.some((value, index, array) => {
          expect(value).to.be.equal(primitive[index])
          expect(index).to.be.a('number')
          expect(array).to.be.equal(arr)
          expect(this).not.to.be.equal('test')

          return value < 15
        }, 'test')
      ).to.be.true()
    })

    it('some - it support changes on initial array (modifying, appending, and deleting)', () => {
      let arr = new ArrayT('number', 1, 2, 3, 4)
      // modify
      expect(
        arr.some((elem, index, arr) => {
          arr[index + 1] -= 3
          return elem < 2
        })
      ).to.be.equal(true)

      arr = new ArrayT('number', 1, 2, 3)
      // append
      let i = 0
      expect(
        arr.some((elem, index, arr) => {
          arr.push(4)
          i = index
          return elem > 2
        })
      ).to.be.true()
      expect(i).to.be.equal(2)

      // delete
      arr = new ArrayT('number', 1, 2, 3, 4)
      i = 0
      expect(
        arr.some((elem, index, arr) => {
          arr.pop()
          i = index
          return elem > 2
        })
      ).to.be.false()
      expect(i).to.be.equal(1)
    })

    it('sort - it should behave like arrays', () => {
      const months = new ArrayT('string', 'March', 'Jan', 'Feb', 'Dec')
      expect(months.sort().toArray()).to.be.eql(['Dec', 'Feb', 'Jan', 'March'])
      expect(months.toArray()).to.be.eql(['Dec', 'Feb', 'Jan', 'March'])

      const numArray = new ArrayT('number', 1, 30, 4, 21, 100000)
      expect(numArray.sort().toArray()).to.be.eql([1, 100000, 21, 30, 4])

      expect(
        new ArrayT('number', 4, 2, 5, 1, 3).sort((a, b) => a - b).toArray()
      ).to.be.eql([1, 2, 3, 4, 5])

      expect(
        new ArrayT('string', 'réservé', 'premier', 'communiqué', 'café', 'adieu', 'éclair')
          .sort((a, b) => a.localeCompare(b)).toArray()
      ).to.be.eql(['adieu', 'café', 'communiqué', 'éclair', 'premier', 'réservé'])
    })

    it('splice - it should behave like arrays', () => {
      const arr = new ArrayT('string', 'Jan', 'March', 'April', 'June')
      expect(arr.splice(1, 0, 'Feb').toArray()).to.be.eql([])
      expect(arr.toArray()).to.be.eql(['Jan', 'Feb', 'March', 'April', 'June'])
      expect(arr.splice(4, 1, 'May').toArray()).to.be.eql(['June'])
      expect(arr.toArray()).to.be.eql(['Jan', 'Feb', 'March', 'April', 'May'])

      let myFish = new ArrayT('string', 'angel', 'clown', 'mandarin', 'sturgeon')
      let removed = myFish.splice(2, 0, 'drum')
      expect(myFish.toArray()).to.be.eql(['angel', 'clown', 'drum', 'mandarin', 'sturgeon'])
      expect(removed.toArray()).to.be.eql([])

      myFish = new ArrayT('string', 'angel', 'clown', 'mandarin', 'sturgeon')
      removed = myFish.splice(2, 0, 'drum', 'guitar')
      expect(myFish.toArray()).to.be.eql(['angel', 'clown', 'drum', 'guitar', 'mandarin', 'sturgeon'])
      expect(removed.toArray()).to.be.eql([])

      myFish = new ArrayT('string', 'angel', 'clown', 'drum', 'mandarin', 'sturgeon')
      removed = myFish.splice(3, 1)
      expect(myFish.toArray()).to.be.eql(['angel', 'clown', 'drum', 'sturgeon'])
      expect(removed.toArray()).to.be.eql(['mandarin'])

      myFish = new ArrayT('string', 'angel', 'clown', 'drum', 'sturgeon')
      removed = myFish.splice(2, 1, 'trumpet')
      expect(myFish.toArray()).to.be.eql(['angel', 'clown', 'trumpet', 'sturgeon'])
      expect(removed.toArray()).to.be.eql(['drum'])

      myFish = new ArrayT('string', 'angel', 'clown', 'trumpet', 'sturgeon')
      removed = myFish.splice(0, 2, 'parrot', 'anemone', 'blue')
      expect(myFish.toArray()).to.be.eql(['parrot', 'anemone', 'blue', 'trumpet', 'sturgeon'])
      expect(removed.toArray()).to.be.eql(['angel', 'clown'])

      myFish = new ArrayT('string', 'parrot', 'anemone', 'blue', 'trumpet', 'sturgeon')
      removed = myFish.splice(2, 2)
      expect(myFish.toArray()).to.be.eql(['parrot', 'anemone', 'sturgeon'])
      expect(removed.toArray()).to.be.eql(['blue', 'trumpet'])

      myFish = new ArrayT('string', 'angel', 'clown', 'mandarin', 'sturgeon')
      removed = myFish.splice(-2, 1)
      expect(myFish.toArray()).to.be.eql(['angel', 'clown', 'sturgeon'])
      expect(removed.toArray()).to.be.eql(['mandarin'])

      myFish = new ArrayT('string', 'angel', 'clown', 'mandarin', 'sturgeon')
      removed = myFish.splice(2)
      expect(myFish.toArray()).to.be.eql(['angel', 'clown'])
      expect(removed.toArray()).to.be.eql(['mandarin', 'sturgeon'])
    })

    it('toString - to string method should be like in arrays', () => {
      const numArray = new ArrayT('number')
      numArray.push(2, 3)
      expect(numArray.toString()).to.be.equal('2,3')

      const personCollection = new ArrayT(Person)
      personCollection.push(new Person('john doe'), new Person('jane doe'))
      expect(personCollection.toString()).to.be.equal('name: john doe,name: jane doe')
    })

    it('toLocaleString - to string method should be like in arrays', () => {
      const dateArray = new ArrayT(Date, new Date('21 Dec 1997 14:12:00 UTC'))
      expect(
        dateArray.toLocaleString('en', { timeZone: 'UTC' })
      ).to.be.equal('12/21/1997, 2:12:00 PM')

      const numArray = new ArrayT('number', 500, 8123, 12)
      expect(
        numArray.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' })
      ).to.be.equal('¥500,¥8,123,¥12')
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

    it('unshift - it should behave like arrays', () => {
      const arr = new ArrayT('number', 1, 2, 3)
      expect(arr.unshift(4, 5)).to.be.equal(5)
      expect(arr.toArray()).to.be.eql([4, 5, 1, 2, 3])
    })

    it('unshift - it should throw on unsupported value', () => {
      expect(() => {
        new ArrayT('number', 1, 2, 3).unshift(1, 'a', 'b')
      }).to.throw()
    })

    it('values - it should behave like arrays', () => {
      const arr = new ArrayT('string', 'a', 'b', 'c')
      const iter = arr.values()

      expect(iter.next()).to.be.eql({ value: 'a', done: false })
      expect(iter.next()).to.be.eql({ value: 'b', done: false })
      expect(iter.next()).to.be.eql({ value: 'c', done: false })
      expect(iter.next()).to.be.eql({ value: undefined, done: true })

      let i = 0
      const primArr = ['a', 'b', 'c']
      for (const val of arr.values()) {
        expect(val).to.be.equal(primArr[i])
        i++
      }
    })
  })
}
