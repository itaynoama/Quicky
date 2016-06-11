var mongoose = require('mongoose');
var recipes = require('./newRecipeSchema.js');
var clients = require('./clientSchema.js');

function getRecipe(recipeName, callback) {
	var query = recipes.findOne().where('name', recipeName);
    query.exec(function(err, doc){
		if (err) {
			console.log("failed to find the recipe");
			return;
		} else{
			callback(doc);
		}
    });
}

exports.getRecipe;

exports.getUnmodifiedRecipes = function(req, res) {
	var query = recipes.find();
	query.where('modified', false).select('-_id');
	query.exec(function(err, docs) {
		var json = JSON.stringify(docs, null, 4);
		console.log(json);
//		console.log(typeof json);
		var parse = JSON.parse(json);
		console.log(parse);
		//console.log(parse[0].ingredients[0].side);
        res.json(docs);
	});
}

exports.getModifiedRecipes = function(time) {
	var query = recipes.find();
	query.where('timers.total', time).select('-_id').select('-timers._id');
	query.exec(function(err, docs) {
		var json = JSON.stringify(docs, null, 4);
		var parse = JSON.parse(json);
		console.log(json);
		console.log(parse);
		res.json(docs);
	})
}

//exports.updateSteps = function(recipeName, steps) {
//	var query = recipes.findOne().where('name', recipeName);
//	query.exec(function(err, doc) {
//		if (err) {
//			console.log("error");
//			return;
//		}else {
//			doc.set('steps', steps);
//			doc.set('modified', true);
//			doc.save(function(err) {
//				if (err) {
//					console.log("failed to update");
//					return;
//				}else {
//					console.log("updating complete");
//				console.log(doc);
//				}
//
//			});
//		}
//
//	});
//}


exports.updateSteps = function(recipeName, steps) {
	getRecipe(recipeName, function(doc) {
		doc.set('steps', steps);
		doc.set('modified', true);
		doc.save(function(err) {
			if (err) {
				console.log("failed saving");
			}
			else{
				console.log("updating complete");
			}
		});
	});
}

exports.increaseLikes = function(recipeName) {
	getRecipe(recipeName, function(doc) {
		var query = doc.update({$inc: {likes: 1}});
		query.exec(function(err) {
			if (err) {
				console.log("failed incrementing the 'like' of recipe");
			} else {
				console.log("likes updated");
			}
		});
	});
}

exports.findClient



