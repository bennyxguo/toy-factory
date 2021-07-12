const { forEach, map } = require('../index')
const assert = require('assert/strict')

const test = (desc, fn) => {
  try {
    console.log('---->', desc)
    fn()
  } catch (err) {
    console.log(err.message)
  }
}

test('The forEach function', () => {
  let sum = 0
  forEach([1, 2, 3], (value) => {
    sum += value
  })

  assert.strictEqual(sum, 6, 'Expected summing array to equal 6')
})

// Testing map function
test('The map function', () => {
  const result = map([1, 2, 3], (value) => {
    return value * 2
  })
  // result === [2, 4, 6]
  assert.deepStrictEqual(result, [2, 4, 6])
  // assert.strictEqual(result[0], 2)
  // assert.strictEqual(result[1], 4)
  // assert.strictEqual(result[2], 7)
})

console.log('Congrats, test passed!')
