const bcrypt = require("bcryptjs")
const User = require("../models/user")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

// Local Strategy
passport.use(
  new LocalStrategy({ usernameField: "email", passwordField: 'password' }, (username, password, done) => {
    // Match User
    User.findOne({ email: username })
      .then(user => {
        // if we have no user return an error
        if(!user) {
          return done(null, false, { message: "This user does not exist." })
          // return existing users
        } else {
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err

            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false, { message: "Password and email do not match." })
            }
          })
        }
      })
      .catch(err => {
        return done(null, false, { message: `from LocalStrategy catch: ${err}` })
      })
  })
)

module.exports = passport