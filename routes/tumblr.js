var express = require('express');
var axios = require('axios');

var spotifyHelper = require('../helpers/spotify_helper');

var tumblrRouter = express.Router();

const consumer_public_key =
  'NF3QHodm2PoqByjVp4oTOSlV7QwZ9qzeIgnYPsS18j0dtWxZ4c';

tumblrRouter.route('/posts').get(function(req, res) {
  getPosts().then(data => {
    res.json(data);
  });
});

async function getPosts() {
  blogName = 'beyniminkustuklari.tumblr.com';

  let limit = 50;
  let offset = 0;
  let tracks = [];
  let currentData = [];

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
            post['audio_source_url'].split('https://open.spotify.com/track/')[1]
        );

      tracks = tracks.concat(spotifyPosts);
    });
  } while (currentData['_links']);

  if (tracks.length > 0) {


    let spotifyUris = spotifyHelper.getTracks(tracks.join(','));

    return spotifyUris;
  }
}

module.exports = tumblrRouter;
