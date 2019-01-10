var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    birtydate: {
      type: String,
      required: false
    },
    country: {
      type: String,
      required: true
    },
    images: {
      type: Array,
      required: false
    },
    followers: {
      type: Array,
      required: false
    },
    product: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    href: {
      type: String,
      required: true
    }
  },
  { collection: 'users' }
);

module.exports = mongoose.model('User', userSchema);
