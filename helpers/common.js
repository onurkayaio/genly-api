var express = require('express');
var axios = require('axios');

var Song = require('../models/song');

const spotify_base_url = 'https://api.spotify.com/v1';

module.exports = {
  getTracks: function (trackIds, accessToken) {
    return axios
      .get(`${ spotify_base_url }/tracks?ids=${ trackIds }`, {
        headers: {
          Authorization: accessToken
        }
      })
      .then(data => {
        for (let track of data['data']['tracks']) {
          var song = new Song(track);
          song.save();
        }

        return data['data']['tracks'];
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};
