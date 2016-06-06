var mongoose = require('mongoose');
var recipes = require('./recipeSchema.js');

exports.getUnmodifiedRecipes = function() {
	var query = recipes.find();
	query.where('modified', false).select('-_id');
	query.exec(function(err, docs) {
		var json = JSON.stringify(docs, null, 4);
		console.log(json);
//		console.log(typeof json);
		var parse = JSON.parse(json);
		console.log(parse);
		console.log(parse[0].ingredients[0].side);
	});
}

exports.getModifiedRecipes = function(time) {
	var query = recipes.find();
	query.where('timers.total', time).select('-_id');
	query.exec(function(err, docs) {
		var json = JSON.stringify(docs, null, 4);
		var parse = JSON.parse(json);
		console.log(json);
		console.log(parse);
	})
}
