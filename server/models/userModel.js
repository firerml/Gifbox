var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  images: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Image',
    index: true
  }],
  searchIndex: [{
    keyword: {type: String, lowercase: true, trim: true},
    imageIds: [mongoose.Schema.ObjectId]
  }]
});

var userModel = mongoose.model('User', userSchema);

module.exports = userModel;