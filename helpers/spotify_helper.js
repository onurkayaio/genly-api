var express = require('express');
var axios = require('axios');

const spotify_base_url = 'https://api.spotify.com/v1';
const token =
  'Bearer BQCxFSNtCxbs-ylondluGleQDs-FZcP-CllxL-73TZhVOWLd994Adw2n6-2uK6DWESQhVVZ-LuDI6O0n4DSm5cgiApxxEuCnt9VYxBuo00SiN4V9oNOvLkaLnq5Zv7EUUq8bVygojcpHBW2a4LzXXEUChM4POgbs1rGSQVT182nWZ8Q7pA2dooMRV4JTyTxDAUJvYScFj6vj_8JbS-AHvEe3Dhcquvrlu0WWaGcHLWNeUScHczSZiLL74owwMtxQgWsQqreMNn4jlMagkSNgglyyV6_PwtBogWM';

module.exports = {
  getTracks: function(trackIds) {
    return axios
      .get(`${spotify_base_url}/tracks?ids=${trackIds}`, {
        headers: {
          Authorization: token
        }
      })
      .then(data => {
        return data['data']['tracks'];
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
