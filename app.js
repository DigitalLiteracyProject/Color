var databaseURL = 'mongodb://dlp:colordlp@ds061681.mongolab.com:61681/colordlp';

//THE APP
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 5000;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var moment = require('moment');

var basic = require('./functions/basic.js');
var consoleLogger = require('./functions/basic.js').consoleLogger;
var middleware = require('./functions/middleware.js');
var email = require('./functions/email.js');
var routes = require('./routes/router.js');
var basicAPI = require('./routes/basic_api.js');
var loginAPI = require('./routes/login_api.js');
var logoutAPI = require('./routes/logout_api.js');

var receivedLogger = function (module) {
    var rL = require('./functions/basic.js').receivedLogger;
    rL('app.js', module);
};
var successLogger = function (module, text) {
    var sL = require('./functions/basic.js').successLogger;
    return sL('app.js', module, text);
};
var errorLogger = function (module, text, err) {
    var eL = require('./functions/basic.js').errorLogger;
    return eL('app.js', module, text, err);
};

mongoose.connect(databaseURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: Problem while attempting to connect to database'));
db.once('open', function () {
    consoleLogger("Successfully connected to database");
});

// view engine setup
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/bower_components", express.static(path.join(__dirname, '/bower_components')));
app.use("/public", express.static(path.join(__dirname, '/public')));
app.use("/views", express.static(path.join(__dirname, '/views')));
app.use("/error", express.static(path.join(__dirname, '/public/error')));

app.use(cookieParser());
app.use(session({
    key: 'colorDLPSessKey',
    cookie: {path: '/', httpOnly: true, secure: false, maxAge: 604800000000},
    secret: 'hssjbm12234bsidh)))^Hjdsb',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

//configure passport
require('./passport/passport.js')(passport, LocalStrategy);


io.on('connection', function (socket) {
    socket.on('joinRoom', function (data) {
        var room = data.room;
        socket.join(room);
        socket.emit('joined');
    });
});

app.get('/socket.io/socket.io.js', function (req, res) {
    res.sendfile("socket.io/socket.io.js");
});

//getting files
app.get('/', routes.index_Html);
app.get('/index.html', routes.index_Html);
app.get('/color.html', middleware.ensureAuthenticatedAngular, middleware.addUserData, routes.color_Html);

//login api
app.post('/createAccount', loginAPI.createAccount);
app.post('/localUserLogin', loginAPI.localUserLogin);

app.get('/api/getUserData', loginAPI.getUserData);
//app.post('/api/clientStartUp', middleware.ensureAuthenticatedAngular, middleware.addUserData, basicAPI.clientStartUp);

//logout api
app.post('/api/logoutClient', middleware.ensureAuthenticatedAngular, middleware.addUserData, logoutAPI.logoutClient);

//error handlers
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    consoleLogger(errorLogger('404 Handler', 'New 404 DEVELOPMENT error'));
    res.status(err.status);
    res.sendFile(path.join(__dirname, './public/error/', '404.html'));
});

app.post('/contactUs', basicAPI.contactUs);

server.listen(port, function () {
    consoleLogger("Server listening at port " + port);
});

exports.io = io;