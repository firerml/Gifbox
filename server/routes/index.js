var express = require('express');
var router = express.Router();

/*
Our DB looks like:
{
	1: {
	  pics: [{id: 123, name: 'Pikachu Fun', url: pika.gif} ...],
	  index: {'pikachu': [123], 'fun': [123]}
	}
}
*/

router.post('/pics/', function(req, res, next) {
	var userDocs = req.db.collection(req.body.user_id.toString());
	userDocs.collection('pics').insert({
  	name: req.body.name,
  	url: req.body.url
  }, function(err, result) {
  	res.send(result.result.ok === 1);
  });
});

router.get('/pics/', function(req, res, next) {
	var pics = req.db.collection(req.query.user_id.toString());
  pics.find().toArray(function(err, docs) {
  	res.send(docs);
  });
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