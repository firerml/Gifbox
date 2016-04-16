var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/gifbook');
var db = mongoose.connection;
var Schema = mongoose.Schema;

var picSchema = Schema({
  name: {type: String, index: true, required: true},
  url: {type: String, required: true}
});

var userSchema = Schema({
  pics: [{
    type: Schema.Types.ObjectId,
    ref: 'Pic',
    index: true}],
  searchIndex: [{
    keyword: {type: String, lowercase: true, trim: true},
    picIds: [Schema.Types.ObjectId]
  }]
});

// userSchema.methods.speak = function() {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
//   console.log(greeting);
// }

var schemas = {
  'User': mongoose.model('User', userSchema),
  'Pic': mongoose.model('Pic', picSchema)
}

module.exports = schemas;
