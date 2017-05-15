var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Favorites.find({'postedBy':req.decoded._doc._id})
    .populate('postedBy')
    .populate('dishes')
    .exec(function (err, favorites) {
        if (err) throw err;
        res.json(favorites);
    });
})

.post(function (req, res, next) {
    Favorites.find({'postedBy':req.decoded._doc._id})
    .exec(function(err, favorites){
        if (err) throw err;
        
       	//if user already has favorite document
       	if(favorites.length != 0) {
       		var dishExisted = false;
       		var dishesLength = favorites[0].dishes.length;
       		for( var i=0; i< dishesLength; i++){
       			if(favorites[0].dishes[i] == req.body._id){
       				dishExisted = true;
       				break;
       			}
       		}
       		//if the dish not exists in dishes list, then push it.
       		if(!dishExisted) {
       			favorites[0].dishes.push(req.body._id);
       			favorites[0].save(function(err, favorites) {
       				if(err) throw err;
       				res.json(favorites);
       			});
       		}
       		//if the dish exists, do nothing but return the favorites document.
       		else{
       			res.json(favorites[0]);
       		}
       	}
       	//if user doesn't have a favorite document, then create one for him.
       	else{
       		Favorites.create({"postedBy": req.decoded._doc._id}, function(err, favorites){
       			if(err) throw err;
       			favorites.dishes.push(req.body._id);
       			favorites.save(function(err, favorites){
       				if(err) throw err;
       				console.log('create new favorites document');
       				res.json(favorites);
       			})
       		});
       	}
    });
})

.delete(function (req, res, next) {
    Favorites.remove({'postedBy':req.decoded._doc._id}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

favoriteRouter.route('/:dishId')
.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
	Favorites.find({'postedBy': req.decoded._doc._id}, function(err, favorites) {
		if(err) return err;
		if(favorites.length) {
			var dishesLength = favorites[0].dishes.length
			for(var i=0; i<dishesLength; i++) {	
				favorites[0].dishes.remove(req.params.dishId);
				break;
			}
			favorites[0].save(function(err,favorites) {
				if(err) throw err;
				res.json(favorites);
			});
		}
		else{
			res.json(favorites[0]);
		}
	});
});


module.exports = favoriteRouter;