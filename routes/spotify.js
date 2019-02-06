var express = require('express');
var axios = require('axios');
const store = require('./../store');

var spotifyRouter = express.Router();

var { arrayChunk } = require('../helpers/helper');

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

        getPlaylistCover(playlistData['id'], accessToken).then(data => {
          console.log(data);
          store.insertPlaylist(
            playlistData['external_urls'].spotify,
            blogName.split('|')[0].replace(/ /g, ''),
            data
          );
        });

        res.json({
          status: 201,
          data: playlistData
        });
      });
    }
  );
});

spotifyRouter.route('/playlist/popular').get(function (req, res) {
  store.getRecentPlaylists().then((value) => {
    res.json(value);
  });
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

async function getPlaylistCover(playlistId, accessToken) {
  return await axios
    .get(`${ spotify_base_url }/playlists/${ playlistId }/images`, {
      headers: {
        Authorization: accessToken
      }
    })
    .then(data => {
      console.log(data['data'][1]['url'])
      return data['data'][1]['url'];
    })
    .catch(function (error) {
      console.log(error);
    });
}

function tracksToSpotifyUris(tracks) {
  let uris = [];

  tracks.forEach(track => {
    uris.push(track['uri']);
  });

  return uris;
}

module.exports = spotifyRouter;
