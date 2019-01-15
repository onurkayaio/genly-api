var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    posts: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: false
    },
    uuid: {
      type: String,
      required: true
    },
    total_posts: {
      type: Number,
      required: false
    },
  },
  { collection: 'blog' }
);

module.exports = mongoose.model('Blog', blogSchema);
