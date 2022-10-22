'use strict'

/**
 * Module dependencies.
 */

const express = require('express')
const logger = require('morgan')
const path = require('path')
const session = require('express-session')
const methodOverride = require('method-override')

const app = (module.exports = express())

// set our default template engine to "Pug"
app.set('view engine', 'pug')

// set views for error and 404 pages
app.set('views', path.join(__dirname, 'views'))

// define a custom res.message() method
// which stores messages in the session
app.response.message = function (msg) {
  // reference `req.session` via the `this.req` reference
  const sess = this.req.session
  // simply add the msg to an array for later
  sess.messages = sess.messages || []
  sess.messages.push(msg)
  return this
}

// log
if (!module.parent) app.use(logger('dev'))

// serve static files
app.use(express.static(path.join(__dirname, 'public')))

// session support
app.use(
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'some secret here'
  })
)

// parse request bodies (req.body)
app.use(express.urlencoded({ extended: true }))

// allow overriding methods in query (?_method=put)
app.use(methodOverride('_method'))

// expose the "messages" local variable when views are rendered
app.use(function (req, res, next) {
  const msgs = req.session.messages || []

  // expose "messages" local variable
  res.locals.messages = msgs

  // expose "hasMessages"
  res.locals.hasMessages = !!msgs.length

  // empty or "flush" the messages so they
  // don't build up
  req.session.messages = []

  next()
})

// load models
const db = require('./lib/boot-models')({
  verbose: true,
  dbConfig: 'sqlite::memory'
})

// Optional DB config:
// {
//   dialect: 'sqlite',
//   storage: 'db/database.sqlite'
// }
db.sync()
  .then(() => {
    db.models.tag.create({ name: 'test' })
  })

app.use((req, res, next) => {
  console.log('=> %s %s %s', req.method, req.url, req.params)
  next()
})

require('./lib/boot-controllers')(app, { db, verbose: !module.parent })

app.use(function (err, req, res, next) {
  // log it
  if (!module.parent) console.error(err.stack)

  // error page
  res.status(500).render('5xx')
})

// assume 404 since no middleware responded
app.use(function (req, res, next) {
  res.status(404).render('404', { url: req.originalUrl })
})

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000)
  console.log('Express started on port 3000')
  // console.log(app._router.stack)
}
