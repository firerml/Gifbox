var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/server');

var User = require('../models/userModel');
var Image = require('../models/imageModel');

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
