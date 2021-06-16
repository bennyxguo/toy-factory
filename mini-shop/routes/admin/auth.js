const express = require('express')
const usersRepo = require('../../repositories/users')
const { handleErrors } = require('./middlewares')
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requirePasswordForUser
} = require('./validators')

const signupTemplate = require('../../views/admin/auth/signup')
const signinTemplate = require('../../views/admin/auth/signin')

const router = express.Router()

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req }))
})

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body
    const user = await usersRepo.create({ email, password })

    req.session.userId = user.id

    res.redirect('/admin/products')
  }
)

router.get('/signin', (req, res) => {
  res.send(signinTemplate({ req }))
})

router.post(
  '/signin',
  [requireEmailExists, requirePasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body

    const user = await usersRepo.getOneBy({ email })
    req.session.userId = user.id

    res.redirect('/admin/products')
  }
)

router.get('/signout', (req, res) => {
  req.session = null // Clear out any cookie session
  res.redirect('/signin')
})

module.exports = router
