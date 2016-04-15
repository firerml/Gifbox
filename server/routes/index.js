var express = require('express');
var mongo = require('mongodb').MongoClient;
var router = express.Router();

DB_URL = 'mongodb://localhost:27017/server'

router.post('/pics/', function(req, res, next) {
	mongo.connect(DB_URL, function(err, db) {
		var pics = db.collection(req.body.user_id.toString());
		pics.insert({
    	name: req.body.name,
    	url: req.body.url
    }, function(err, result) {
    	res.send(result.result.ok === 1);
    });
	});
});

router.get('/pics/', function(req, res, next) {
	mongo.connect(DB_URL, function(err, db) {
		var pics = db.collection(req.query.user_id.toString());
    pics.find().toArray(function(err, docs) {
    	res.send(docs);
    });
	});
});

module.exports = router;
