var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/gifbook');

var User = require('../models/userModel');
var Image = require('../models/imageModel');
/*
Our DB looks like:
{
	1: {
	  pics: [{id: 123, name: 'Pikachu Fun', url: pika.gif} ...],
	  index: {'pikachu': [123], 'fun': [123]}
	}
}
*/

router.post('/images/', function(req, res, next) {
    console.log(req.body)
    var image = new Image();
    image.name = req.body.name;
    image.url = req.body.url;
    image.save(function(err, image) {
        res.status(201).send(image);
    })
        
});

router.get('/images/', function(req, res, next) {

    Image.find({}, function(err, images) {
        res.status(200).send(images);
    })

});

module.exports = router;

	// 	// Update name index with words in name.
	// 	if (nameIndex === undefined) {
	// 		nameIndex = {};
	// 	}
	// 	var nameWords = promptedName.toLowerCase().split(' ');
	// 	for (var i in nameWords) {
	// 		var nameWord = nameWords[i].toLowerCase().trim();
	// 		if (nameIndex[nameWord] === undefined) {
	// 			nameIndex[nameWord] = [newItemId];
	// 		} else {
	// 			nameIndex[nameWord].push(newItemId);
	// 		}
	// 	}
	// 	syncStorage.set({'-1': nameIndex});

	// 	// Save the image URL.
	// 	syncStorage.set(newImageData, function() {
	// 		// TODO: If runtime.lastError, alert user of error.
	// 		return;
	// 	});	
	// });