'use strict'

const { ArrayT } = require('../index')

// Primitive type example //
const numArray = new ArrayT('number', 2, 3)
numArray.push(4, 5)
console.log(numArray.toString()) // 2,3,4,5
console.log(JSON.stringify(numArray)) // [2,3,4,5]
console.log(numArray.toArray()) // [ 2, 3, 4, 5 ]

console.log('for loop')
for (let i = 0; i < numArray.length; i++) {
  const item = numArray[i]
  console.log(`numArray[${i}] = ${item}`) // numArray[0] = 2
}

console.log('for of loop')
for (const item of numArray) {
  console.log(item) // 2
}

console.log('for in loop')
for (const i in numArray) {
  console.log(`numArray[${i}] = ${numArray[i]}`) // numArray[0] = 2
}

try {
  numArray.push('4')
} catch (err) {
  console.log(err.toString()) // Error: ERR_INVALID_VALUE_TYPE
}

class Person {
  constructor (name) {
    this.name = name
  }

  toString () {
    return `name: ${this.name}`
  }
}

// Complex type example //
const personCollection = new ArrayT(Person)
personCollection.push(new Person('john doe'))
personCollection.push(new Person('jane doe'))

try {
  personCollection.push({ name: 'joe doe' })
} catch (err) {
  console.log(err.toString()) // Error: ERR_INVALID_VALUE_TYPE
}
console.log(personCollection.toString()) // name: john doe,name: jane doe
console.log(JSON.stringify(personCollection)) // [{"name":"john doe"},{"name":"jane doe"}]
