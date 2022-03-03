const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const express = require('express')
const http = require('http')
const authRouter = require('./routes/auth')
const passport = require('./passport/setup')
const cors = require('cors')

const MONGO_URI = `mongodb+srv://admin:WZ6e.Psj%40qAPsYH@cluster0.aukx0.mongodb.net/pokedex?retryWrites=true&w=majority`

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(console.log(`MongoDB connected`))
  .catch(err => console.log('mongoose error is ', err))


const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

// Express session
app.use(
  session({
    secret: "some secret string",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGO_URI })
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Express routes
app.use('/', authRouter)
app.get("/", (req, res) => res.send("Good monring sunshine!"))

const httpServer = http.createServer(app)

httpServer.listen(3001, 
  console.log(`
    🚀  Server is running!
    🔉  Listening on port 3001
  `)
)