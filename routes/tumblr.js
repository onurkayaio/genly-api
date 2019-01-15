var express = require('express');
var axios = require('axios');

var { getTracks } = require('../helpers/common');
var { arrayChunk } = require('../helpers/helper');

var tumblrRouter = express.Router();

const consumer_public_key =
  'NF3QHodm2PoqByjVp4oTOSlV7QwZ9qzeIgnYPsS18j0dtWxZ4c';

var error = {
  status: 403,
  message: 'access token is required.'
};

var Blog = require('../models/blog');

tumblrRouter.route('/posts').get(function (req, res) {
  let accessToken = req.headers['x-access-token'];
  let blogName = req.query['blogName'] + '.tumblr.com';

  if ( !accessToken ) {
    return res.json(error);
  }

  prepareTracksByBlogId(blogName).then(data => {
    if ( data.length === 0 || data.status === 422 || data.status === 404 ) {
      res.status(404).json({
        status: 404,
        message: 'not found post or blog.'
      });
    } else {
      getTracksByTrackIds(data['tracks'], accessToken).then(value => {
        res.json({
          status: 200,
          data: {
            tracks: value,
            profile: data['profile']
          }
        });
      });
    }
  });
});

async function prepareTracksByBlogId(blogName) {
  let limit = 50;
  let offset = 0;
  let tracks = [];
  let currentData = [];

  try {
    do {
      if ( currentData['_links'] ) {
        offset = currentData['_links']['next']['query_params']['offset'];
      }

      var path = `https://api.tumblr.com/v2/blog/${ blogName }/posts/audio?limit=${ limit }&offset=${ offset }&api_key=${ consumer_public_key }&limit=50`;

      await axios.get(path).then(data => {
        currentData = data['data']['response'];

        let spotifyPosts = data['data']['response']['posts']
          .filter(
            post =>
              post['type'] === 'audio' &&
              post['audio_type'] === 'spotify' &&
              post['audio_source_url'] != null
          )
          .map(
            post =>
              post['audio_source_url'].split(
                'https://open.spotify.com/track/'
              )[1]
          );

        let spotifyPostsAsTexts = [];
        try {
          spotifyPostsAsTexts = data['data']['response']['posts']
            .map(
              post =>
                post['body'] ? post['body'].split('https://open.spotify.com/track/')[1].split(',')[0] : ''
            ).map(
              value =>
                value.substring(0, value.length - 1)
            ).map(
              value =>
                value.split('&')[0]
            ).filter(Boolean);
        } catch ( e ) {
          let spotifyPostsAsTexts = [];
        }

        tracks = tracks.concat(spotifyPostsAsTexts);
        tracks = tracks.concat(spotifyPosts);
      });
    } while (currentData['_links']);

    var blog = new Blog(currentData['blog']);
    blog.save();

    return {
      tracks: tracks.filter(onlyUnique),
      profile: currentData['blog']
    };
  } catch ( err ) {
    error.status = err.response ? err.response.status : 422;
    error.message = err.response ? err.response.statusText : 'unprocessable entity.';

    return error;
  }
}

async function getTracksByTrackIds(trackIds, accessToken) {
  let chunkedData = arrayChunk(trackIds, 10);
  let generatedResponse = [];

  for (let elem of chunkedData) {
    try {
      // here candidate data is inserted into
      let insertResponse = await getTracks(elem, accessToken);
      // and response need to be added into final response array
      generatedResponse = generatedResponse.concat(insertResponse);
    } catch ( error ) {
    }
  }

  return generatedResponse; // return without waiting for process of
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}


module.exports = tumblrRouter;
