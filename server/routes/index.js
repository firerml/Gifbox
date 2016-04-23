var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gifbook'
mongoose.connect(mongoUri);

var User = require('../models/userModel');
var Image = require('../models/imageModel');

// Get or create user.
router.post('/user/', function(req, res, next) {
  // Get or create User in DB.
  User.findOne({chromeId: req.body.chromeId}, function(err, user) {
    if (err) { return next(new Error('Error: ' + err)); }
    // User exists.
    if (user != null) { 
      res.status(200).json(user); 
      return;
    }
    // Create user.
    user = new User({
      chromeId: req.body.chromeId,
      email: req.body.email,
      images: [],
      searchIndex: {}
    })
    user.markModified('searchIndex');
    user.save(function(err, user) {
      if (err) { return next(new Error('Failed to save image: ' + err)); }
      res.status(201).json(user);
      return;
    });
  });
});

// Save image.
router.post('/image/', function(req, res, next) {
  // To do: Make both saves atomic.
  var image = new Image(req.body.image);
  image.save(function(err, image) {
    if (err) { return next(new Error('Failed to save image: ' + err))}
    
    User.findOne({chromeId: req.body.chromeId}, function(err, user) {
    	if (user === null) { return next(new Error('User does not exist')); }
    	
      user.images.push(image);
    	var imageNameWords = req.body.image.name.trim().toLowerCase().split(' ');
    	imageNameWords.forEach(function(word) {
    		for (var i = 1; i < word.length + 1; i++) {
    			var wordPortion = word.slice(0, i);
    			var searchTermResults = user.searchIndex[wordPortion];
    			if (searchTermResults === undefined) {
    				user.searchIndex[wordPortion] = [image.id]
    			} else {
    				user.searchIndex[wordPortion].push(image.id)
    			}
    		}
    	});
    	user.markModified('searchIndex');
    	user.save(function(err, user) {
    		if (err) { return next(new Error('Failed to save image: ' + err))}
    	});
    })
    res.status(201).json(image);
    return;
  });
        
});

// Get a user's images.
router.get('/image/', function(req, res, next) {
  User.findOne({chromeId: req.query.chromeId}, function(err, user) {
    if (err) { return next(new Error('User auth failure: ' + err)); }
    Image.find({_id: {$in: user.images}}, function(err, images) {
        if (err) { return next(new Error('Failed to get images: ' + err))}
        res.status(200).json(images);
        return;
    });
  });
});

// Delete image.
router.delete('/image/', function(req, res, next) {
  User.findOne({chromeId: req.query.chromeId}, function(err, user) {
    if (err) { return next(new Error('User auth failure: ' + err)); }
    Image.findOne({_id: req.query.imageId}, function(err, image) {
        if (err) {
          res.status(404).json({success: false, error: err});
          return;
        } else {
          var imageName = image.name;
          image.remove(function(err) {
            if (err) { res.status(500).json({success: false, error: err}); return; };

            // Remove this image from index.
            var imageNameWords = image.name.trim().toLowerCase().split(' ');
            imageNameWords.forEach(function(word) {
              for (var i = 1; i < word.length + 1; i++) {
                var wordPortion = word.slice(0, i);
                var imageIds = user.searchIndex[wordPortion];
                if (imageIds === undefined) { continue; }
                var imageIdIndex = imageIds.indexOf(image.id);
                if (imageIdIndex == -1) { continue; }
                imageIds.splice(imageIdIndex, 1);
                if (imageIds.length == 0) {
                  delete user.searchIndex[wordPortion];
                }
              }
            });
            user.markModified('searchIndex');
            user.save(function(err, user) {
              if (err) { return next(new Error('Failed to save image: ' + err))}
            });
          });
          res.status(200).send({success: true});
          return;
        }
    });
  });
});

// Search a user's images.
router.get('/image/search/', function(req, res, next) {
  var searchQuery = req.query.q.toLowerCase();
  User.findOne({chromeId: req.query.chromeId}, function(err, user) {
  	if (err) { return next(new Error('User auth failure: ' + err)); }
  	var queryWords = searchQuery.split(' ');
  	var imageIds = user.searchIndex[queryWords[0].trim()];
  	
    // No results for first word.
    if (imageIds === undefined) { 
      res.json([]);
      return;
    }

  	imageIds = imageIds.map(function(imageId) { return imageId.toString() });
    // Check results for all words after first.
  	queryWords.slice(1).forEach(function(word) {
  		var wordResults = user.searchIndex[word.trim()];
  		
      // Return if there are no results for this word.
  		if (wordResults === undefined) {
        res.json([]);
        // TODO: sThis needs to end the outer function, not this inner one.
        return;
      }

  		wordResults = wordResults.map(function(imageId) { return imageId.toString() });
  		// Remove any items in the final results not found for this word (results must match ALL the words).
  		imageIds.forEach(function(imageId) {
  			if (wordResults.indexOf(imageId) === -1) { imageIds.pop(imageIds.indexOf(imageId)); }
  		});
  	});
  	// imageIds = imageIds.map(function(imageId) {imageId.toString()})
  	Image.find({_id: {$in: imageIds}}, function(err, images) {
  		if (err) { return next(new Error('Error getting images: ' + err)); }
  		res.json(images);
      return;
  	});
  });
});

module.exports = router;
