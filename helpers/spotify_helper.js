var express = require('express');
var axios = require('axios');

const spotify_base_url = 'https://api.spotify.com/v1';
const token =
  'Bearer BQBTbQtTZA-CsA52HqeY7XrnHvIlKFs07fjY4Ys0Rz5DhQst1NtbTU77nBDe3Ut5N5B5cxCm6JY-KWXOCOOZYS0nKT217NBySlF4nwgR5-S2_qRIyziN97HhhuZKywGDiU1VKC3GwoHPMIyBCh93mK9gWlrU60sc3HJWoB3RxLUGJ-ztFLLOiKeW85TxxHELMzMmi4XYnnixgg-PUbp1Y3gKufv-ikYqE1GQot-wXCKttZFFJ0-KRZLCCv1Yp6H9ux1Z7m2A8N9TeRxhNEkj3o8q34xMEw';

function getTracks(trackIds) {
  return axios
    .get(`${spotify_base_url}/tracks?ids=${trackIds}`, {
      headers: {
        Authorization: token
      }
    })
    .then(data => {
      console.log(data);
      return data['data'];
    })
    .catch(function(error) {
      console.log(error);
    });
}
