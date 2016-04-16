var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  name: {type: String, index: true, required: true},
  url: {type: String, required: true}
});

var imageModel = mongoose.model('Image', imageSchema);

module.exports = imageModel;