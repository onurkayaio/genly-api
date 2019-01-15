var express = require('express');
var axios = require('axios');

var spotifyRouter = express.Router();

var { arrayChunk } = require('../helpers/helper');

var User = require('../models/user');
var Blog = require('../models/blog');
var Playlist = require('../models/playlist');
var Generated = require('../models/generated');

const spotify_base_url = 'https://api.spotify.com/v1';

const error = {
  errors: {
    statusCode: 403,
    message: 'access token is required.'
  }
};

spotifyRouter.route('/me').get(function (req, res) {
  let accessToken = req.headers['x-access-token'];

  if ( !accessToken ) {
    return res.json(error);
  }

  return axios
    .get(`${ spotify_base_url }/me`, {
      headers: {
        Authorization: accessToken
      }
    })
    .then(data => {
      // check user exists, if not add to db.
      User.findOne({ email: data.data.email }, function (error, item) {
        if ( !item ) {
          var user = new User(data.data);
          user.save();
        }
      });

      res.json(data.data);
    })
    .catch(function (error) {
      res.json(error.response.data);
    });
});

spotifyRouter.route('/playlist').post(function (req, res) {
  let name = req.body.name;
  let description = req.body.description;
  let isPublic = req.body.isPublic;
  let tracks = req.body.tracks;

  let accessToken = req.headers['x-access-token'];
  let blogName = req.query['blogName'];
  let email = req.query['email'];

  if ( !accessToken || !blogName || !email ) {
    return res.json(error);
  }

  generatePlaylist(name, description, isPublic, accessToken).then(
    playlistData => {
      let uris = tracksToSpotifyUris(tracks);

      insertTracksToPlaylist(playlistData['id'], uris, accessToken).then(() => {
        Blog.findOne({ name: blogName }, function (error, blog) {
          if ( error ) {
            console.log(error);
          }

          User.findOne({ email: email }, function (error, user) {
            if ( error ) {
              console.log(error);
            }

            var generated = new Generated();

            generated.user = user;
            generated.playlist = playlistData;
            generated.blog = blog;
            generated.save();
          });
        });

        res.json({
          status: 201,
          data: playlistData
        });
      });
    }
  );
});

async function generatePlaylist(name, description, isPublic, accessToken) {
  try {
    return await axios
      .post(
        `${ spotify_base_url }/me/playlists`,
        JSON.stringify({
          name: name,
          description: description,
          public: isPublic
        }),
        {
          headers: {
            Authorization: accessToken
          }
        }
      )
      .then(data => {
        var playlist = new Playlist(data['data']);
        playlist.save();

        return data['data'];
      });
  } catch ( error ) {
    console.log(error);
    return error.response.data;
  }
}

async function insertTracksToPlaylist(playlistId, uris, accessToken) {
  let chunkedUris = arrayChunk(uris, 10);

  for (let elem of chunkedUris) {
    try {
      await axios.post(
        `${ spotify_base_url }/playlists/${ playlistId }/tracks/?position=0&uris=${ elem.join(
          ','
        ) }`,
        null,
        {
          headers: {
            Authorization: accessToken
          }
        }
      );
    } catch ( error ) {
      return error.response.data;
    }
  }

  return;
}

function tracksToSpotifyUris(tracks) {
  let uris = [];

  tracks.forEach(track => {
    uris.push(track['uri']);
  });

  return uris;
}

module.exports = spotifyRouter;
