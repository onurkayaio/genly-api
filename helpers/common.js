var axios = require('axios');

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
        return data['data']['tracks'];
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};
