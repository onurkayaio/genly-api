var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var generatedSchema = new Schema(
  {
    user: {
      type: Array,
      required: true
    },
    playlist: {
      type: Array,
      required: true
    },
    blog: {
      type: Array,
      required: true
    }
  },
  { collection: 'generateds' }
);

module.exports = mongoose.model('Generated', generatedSchema);
