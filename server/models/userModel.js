var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  chromeId: {type: String, unique: true},
  email: {type: String, unique: true},
  images: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Image',
    index: true
  }],
  searchIndex: {type: mongoose.Schema.Types.Mixed, default: {}}
});

var userModel = mongoose.model('User', userSchema);

module.exports = userModel;