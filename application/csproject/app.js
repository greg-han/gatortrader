var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser= require('body-parser');
var logger = require('morgan');
var hbs = require('hbs');
//this is mozillas persistent session app
var session = require('client-sessions');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var searchRouter = require('./routes/search');
var messagesRouter = require('./routes/messages');
var adminRouter    = require('./routes/admin');

//intellij check
/*App.js is the main entry point of the app this is where everything gets set up.
App.use detremines what routing files we use (look in routes folder) when get get http requests.
eg. '/' means root url (oursite.com/) and when we go there, we will use indexRouter -Greg
*/
var app = express();

//This is where "views" and handlebars gets set up -Greg
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//partials are just snippets of re-usable code. -Greg
hbs.registerPartials(__dirname + '/views/partials');

//This is all necessary stuff to parse things like JSON objects, metadata, etc. between client and server -Greg
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cookieParser());
/*
 This is where we tell express that all of our static files (in public) are going to be in /public
 that way, we can access them later. Look in the public directory I left a readme. -Greg
*/
app.use(express.static(path.join(__dirname, 'public')));

//This is the entry point of the app. Notice that above it goes to index.js inside of routes -Greg
app.use(session({
  cookieName : 'session',
  secret: 'balh!!',
  duration: 30*60*1000,
  activeDuration: 5*50*1000,
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);
app.use('/messages', messagesRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
