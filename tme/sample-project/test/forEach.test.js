const { forEach } = require('../index')
const assert = require('assert/strict')

let numbers
beforeEach(() => {
  numbers = [1, 2, 3]
})

it('should sum an array', () => {
  let total = 0
  forEach(numbers, (value) => {
    total += value
  })

  assert.strictEqual(total, 6)
  numbers.push(...[4, 5, 6, 7])
})

it('beforeEach is ran each time', () => {
  assert.strictEqual(numbers.length, 4)
})
