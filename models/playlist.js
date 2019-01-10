var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    external_urls: {
      type: Array,
      required: true
    },
    owner: {
      type: Array,
      required: true
    },
    tracks: {
      type: Array,
      required: true
    },
    snapshot_id: {
      type: String,
      required: true
    },
    uri: {
      type: String,
      required: true
    },
    public: {
      type: Boolean,
      required: true,
      default: 1
    },
    href: {
      type: String,
      required: true
    }
  },
  { collection: 'playlists' }
);

module.exports = mongoose.model('Playlist', playlistSchema);
