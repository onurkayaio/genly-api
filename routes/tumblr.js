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

tumblrRouter.route('/posts').get(function(req, res) {
  let accessToken = req.headers['x-access-token'];
  let blogName = req.query['blogName'] + '.tumblr.com';

  if (!accessToken) {
    return res.json(error);
  }

  prepareTracksByBlogId(blogName).then(data => {
    if (data.statusCode) {
      return res.json(data);
    }

    getTracksByTrackIds(data, accessToken).then(data => {
      res.json({
        status: 200,
        data: data
      });
    });
  });
});

async function prepareTracksByBlogId(blogName) {
  let limit = 50;
  let offset = 0;
  let tracks = [];
  let currentData = [];

  try {
    do {
      if (currentData['_links']) {
        offset = currentData['_links']['next']['query_params']['offset'];
      }

      var path = `https://api.tumblr.com/v2/blog/${blogName}/posts/audio?limit=${limit}&offset=${offset}&api_key=${consumer_public_key}&limit=50`;

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

        tracks = tracks.concat(spotifyPosts);
      });
    } while (currentData['_links']);

    return tracks;
  } catch (err) {
    error.status = err.response.status;
    error.message = err.response.statusText;

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
    } catch (error) {}
  }

  return generatedResponse; // return without waiting for process of
}

module.exports = tumblrRouter;
