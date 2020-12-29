const express = require('express')
const path = require('path')
const app = express()
const session = require('express-session')
const db = require ('./db/database.js')
const volleyball = require('volleyball')
const sequelizeStore = require('connect-session-sequelize')
const passport = require('passport')

const dbStore = new sequelizeStore({
   db: db
})

 dbStore.sync()
// Only use logging middleware when not running tests
const debug = process.env.NODE_ENV === 'test'
app.use(volleyball.custom({ debug }))

//we can use morgan or express-logger instead of volleyball (a fullstacker's product)
// For example, if we use morgan:
// npm install --save morgan

// const morgan = require('morgan');
// app.use(morgan('dev'));</

//body parsing middleware, new version of express includes bodyParser so don't have to install it saperately
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
  secret: process.env.SESSION_SECRET || "My@Secret",
  store: dbStore,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(done);
});
//static middleware
app.use(express.static(path.join(__dirname, '../public')))

app.use('/api', require('./api'))

// Send index.html for any other requests
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname,'../public/index.html'))
})

// error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error')
})

module.exports = app
