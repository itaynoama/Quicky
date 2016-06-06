var mongoose = require('mongoose');
var recipes = require('./recipeSchema.js');

exports.getUnmodifiedRecipes = function(req, res) {
	var query = recipes.find();
	query.where('modified', false).select('-_id');
	query.exec(function(err, docs) {
		var json = JSON.stringify(docs);
		var parse = JSON.parse(json);
		console.log("recipes:");
		console.log(json.ingredient);
//		console.log(json);
	})
}
