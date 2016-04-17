var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  name: {type: String, index: true, required: true, unique: true},
  url: {type: String, required: true},
  lastUsedDate: {type: Date, default: Date.now}
});

var imageModel = mongoose.model('Image', imageSchema);

module.exports = imageModel;