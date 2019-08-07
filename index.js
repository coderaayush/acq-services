var express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var bodyParser = require('body-parser');

var server = http.listen(2000, () => {
    console.log('server is running on port', server.address().port);
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*' );
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('socketio', io);
let apiRoute = require('./src/routes/index');
app.use('/', apiRoute);
