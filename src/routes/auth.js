const router = require('express').Router()
const passport = require('passport')
const bcrypt = require("bcryptjs")
const User = require("../models/user")

router.post('/login', function(req, res, next) {
  passport.authenticate("local", function(err, user) {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err,
        user: null
      })
    }
    if(!user) {
      return res.status(400).json({
        success: false,
        message: "No user found with that email address.",
        user: null
      })
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log('err is ', err)
        return res.status(400).json({
          success: false,
          message: "There was an error logging you in, please check your email and password and try again.",
          user: null
        })
      }
      return res.status(200).json({
        success: true,
        message: "User has been logged in.",
        user
      })
    })
  })(req, res, next)
})

router.post('/signup', function(req, res, next) {
  if(req?.body?.email && req?.body?.password) {
    const newUser = new User({ email: req.body.email, password: req.body.password })
    // Hash password before saving in the db
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash
        newUser
          .save()
          .then(user => {
            return res.status(200).json({
              success: true,
              message: "User has been created.",
              user
            })
          })
          .catch(err => {
            console.log('err is ', err)
            return res.status(400).json({
              success: false,
              message: "There was an error creating your account, please check your email is valid.",
              user: null
            })
          })
      })
    })
  } else {
    return res.status(400).json({
      success: false,
      message: "Sign up requires both an email and password",
      user: null
    })
  }
})

module.exports = router