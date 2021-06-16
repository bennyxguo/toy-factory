const Repository = require('./repository')

class CartRepository extends Repository {}

module.exports = new CartRepository('carts.json')
