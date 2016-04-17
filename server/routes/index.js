var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gifbook'
mongoose.connect(mongoUri);

var User = require('../models/userModel');
var Image = require('../models/imageModel');

router.post('/images/', function(req, res, next) {
    // To do: Make both saves atomic.
    var image = new Image(req.body.image);
    image.save(function(err, image) {
        if (err) { return next(new Error('Failed to save image: ' + err))}
        
        User.findOne({chromeId: req.body.chromeId}, function(err, user) {
        	if (user === null) {
        		user = new User({chromeId: req.body.chromeId});
        	}
        	user.images.push(image);
        	var imageNameWords = req.body.image.name.trim().toLowerCase().split(' ');
        	imageNameWords.forEach(function(word) {
        		for (var i = 1; i < word.length + 1; i++) {
        			var wordPortion = word.slice(0, i);
        			var searchTermResults = user.searchIndex[wordPortion];
        			if (searchTermResults === undefined) {
        				user.searchIndex[wordPortion] = [image._id]
        			} else {
        				user.searchIndex[wordPortion].push(image._id)
        			}
        		}
        	});
        	user.markModified('searchIndex');
        	user.save(function(err, user) {
        		if (err) { return next(new Error('Failed to save image: ' + err))}
        	});
        })
        res.status(201).json(image);
    });
        
});

router.get('/images/', function(req, res, next) {
    Image.find({}, function(err, images) {
        if (err) { return next(new Error('Failed to get images: ' + err))}
        res.status(200).json(images);
    });
});

router.get('/images/search/', function(req, res, next) {
  var searchQuery = req.query.q.toLowerCase();
  User.findOne({chromeId: req.query.user_id}, function(err, user) {
  	if (err) { return next(new Error('User auth failure: ' + err)); }
  	var queryWords = searchQuery.split(' ');
  	var imageIds = user.searchIndex[queryWords[0].trim()];
  	if (imageIds === undefined) { return res.json([]); }
  	imageIds = imageIds.map(function(imageId) { return imageId.toString() });
  	queryWords.slice(1).forEach(function(word) {
  		var wordResults = user.searchIndex[word.trim()];
  		// Return if there are no results for this word.
  		if (wordResults === undefined) { return res.json([]); }
  		wordResults = wordResults.map(function(imageId) { return imageId.toString() });
  		// Remove any items in the final results not found for this word (results must match ALL the words).
  		imageIds.forEach(function(imageId) {
  			if (wordResults.indexOf(imageId) === -1) { imageIds.pop(imageIds.indexOf(imageId)); }
  		});
  	});
  	// imageIds = imageIds.map(function(imageId) {imageId.toString()})
  	Image.find({_id: {$in: imageIds}}, function(err, images) {
  		if (err) { return next(new Error('Error getting images: ' + err)); }
  		return res.json(images);
  	});
  });
});

module.exports = router;
