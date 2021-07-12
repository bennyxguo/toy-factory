const { forEach, map } = require('../index')
const assert = require('assert/strict')

it('The forEach function', () => {
  let sum = 0
  forEach([1, 2, 3], (value) => {
    sum += value
  })

  assert.strictEqual(sum, 6, 'Expected summing array to equal 6')
})

// Testing map function
it('The map function', () => {
  const result = map([1, 2, 3], (value) => {
    return value * 2
  })
  // result === [2, 4, 6]
  assert.deepStrictEqual(result, [2, 4, 6])
})
