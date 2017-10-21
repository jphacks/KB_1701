var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// ---- Renamed and Added by tdomen -----
var commits_regist = require('./routes/commits/commits_regist');

var http = require('http');
var mongoose = require('mongoose');
// ----------------------------------------

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// ---- Added by tdomen -----
// ポート設定
app.set('port', process.env.PORT || 20000);
// --------------------------

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ---- Added by tdomen -----
// ルーティング機能
app.use('/commits_regist', commits_regist);
// --------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log("error1");
    app.use(function(err, req, res, next) {
      console.log("error2");
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
  console.log("error3");
    res.status(err.status || 500);
    res.render('error', {
    message: err.message,
    error: {}
    });
});

// サーバ立ち上げ
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    const mongodbUri = "mongodb://localhost/test";
    const mongOptions = {
      useMongoClient: true,
      socketTimeoutMS: 0,
      keepAlive: true,
      reconnectTries: 30};
    mongoose.Promise = global.Promise;
    mongoose.connect(mongodbUri, mongOptions);
});
// ------------------------------------------

module.exports = app;
