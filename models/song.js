var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = new Schema(
  {
    album: {
      type: Array,
      required: false
    },
    artists: {
      type: Array,
      required: false
    },
    external_urls: {
      type: Array,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    preview_url: {
      type: String,
      required: false
    },
    uri: {
      type: String,
      required: false
    }
  },
  { collection: 'songs' }
);

module.exports = mongoose.model('Song', songSchema);
