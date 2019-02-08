var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var tumblrRouter = require('./routes/tumblr');
var spotifyRouter = require('./routes/spotify');
var app = express();

var PORT = 8080;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cors());

app.use('/tumblr', tumblrRouter);
app.use('/spotify', spotifyRouter);

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
