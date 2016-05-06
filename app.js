var path = require('path')

var express = require('express')
var bodyParser = require('body-parser')
var favicon = require('static-favicon')
var fs = require('fs')
//var logger = require('pomelo-logger').getLogger('apps-log')

var routes = require('./routes/init')

var app = express()


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

var session = require('express-session')
var cookieParser = require('cookie-parser')
var MongoStore = require('connect-mongo')(session)
var settings = require('./settings')

app.use(cookieParser())

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, //30 days
  store: new MongoStore({
    db: settings.db,
    url: 'mongodb://localhost/'+ settings.db,
    host: settings.host,
    port: settings.port
  })
}))

app.use(function (req, res, next) {
  res.locals.user = req.session ? req.session.user :''
  res.locals.url = req.path
  next()
})

routes(app)


// 只用于开发环境
if ('development' == app.get('dev')) {
  app.set('db uri', 'localhost/dev')
}

// 只用于生产环境
if ('production' == app.get('env')) {
  app.set('db uri', 'n.n.n.n/prod')
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'))
})

//var errorLog = fs.createWriteStream('log/error.log', {flags: 'a'})
//
//app.use(function (err, req, res, next) {
//  var meta = '[' + new Date() + '] ' + req.url + '\n'
//  errorLog.write(meta + err.stack + '\n')
//  next()
//})

module.exports = app
