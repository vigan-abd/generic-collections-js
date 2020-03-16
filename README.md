# generic-collections-js

[![Build Status](https://travis-ci.org/vigan-abd/generic-collections-js.svg?branch=master)](https://travis-ci.org/vigan-abd/generic-collections-js)
![npm](https://img.shields.io/npm/v/generic-collections-js)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/vigan-abd/generic-collections-js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/vigan-abd/generic-collections-js/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/vigan-abd/generic-collections-js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/vigan-abd/generic-collections-js/context:javascript)

This library includes generic layer for javascript collections. Currently supported generic types are depicted below:
- `ArrayT` - Generic version of [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) type

## Installing
```console
npm install --save generic-collections-js
```

## Testing
```console
npm run test
```

## Usage
```javascript
const { ArrayT } = require('generic-collections-js')

// Primitive type example //
const numArray = new ArrayT('number')
numArray.push(2, 3)

try {
  numArray.push('4')
} catch (err) {
  console.log(err.toString()) // Error: ERR_INVALID_VALUE_TYPE
}

console.log(numArray.toArray()) // [ 2, 3 ]

```

## Authors
- vigan-abd (vigan.abd@gmail.com)