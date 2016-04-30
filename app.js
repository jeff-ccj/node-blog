var path = require('path');

var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);

var settings = require('./settings');
var routes = require('./routes/index');

var app = express();

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

//app.use('/', routes);
//app.use('/hello', hello);
//app.use('/users', users);



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());
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
}));

app.use(function (req, res, next) {
  res.locals.user = req.session ? req.session.user :'';
  res.locals.url = req.path
  next()
});

routes(app);


// 只用于开发环境
if ('development' == app.get('env')) {
  app.set('db uri', 'localhost/dev');
}

// 只用于生产环境
if ('production' == app.get('env')) {
  app.set('db uri', 'n.n.n.n/prod');
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
