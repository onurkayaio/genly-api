var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var tumblrRouter = require('./routes/tumblr');
var spotifyRouter = require('./routes/spotify');

var app = express();

var PORT = 8080;
var HOST_NAME = 'localhost';
var DATABASE_NAME = 'genly';

mongoose.Promise = global.Promise;

mongoose.connect(
  'mongodb://' + HOST_NAME + '/' + DATABASE_NAME,
  {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true
  }
);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));


app.use('/tumblr', tumblrRouter);
app.use('/spotify', spotifyRouter);

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
